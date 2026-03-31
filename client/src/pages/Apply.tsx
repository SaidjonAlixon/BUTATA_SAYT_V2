import { useState, useCallback } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { upload as uploadToBlob } from "@vercel/blob/client";
import { CheckCircle, Upload, Loader2, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";

// Steps for the form wizard
const steps = [
  { id: 1, title: "Contact Info" },
  { id: 2, title: "Experience" },
  { id: 3, title: "Review" }
];

// Schema for form validation
const formSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number is too short"),
  address: z.string().optional(),
  positionType: z.string().min(1, "Please select a position"),
  experienceYears: z.coerce.number().min(0, "Experience cannot be negative"),
  cdlType: z.string().optional(),
  hasCleanRecord: z.boolean().default(true),
  acceptTerms: z.boolean().optional(),
  driverLicenseFront: z.any().optional().nullable(),
  driverLicenseBack: z.any().optional().nullable(),
  medicalCard: z.any().optional().nullable(),
  resumes: z.array(z.any()).optional(),
  // Owner Operator only
  annualTruckInspection: z.any().optional().nullable(),
  truckPicEngine: z.any().optional().nullable(),
  truckPicUnderEngine: z.any().optional().nullable(),
  truckPicTires: z.any().optional().nullable(),
  // Investor only
  registrationCard: z.any().optional().nullable(),
});

const ACCEPTED_TYPES = ".pdf,.doc,.docx,.jpg,.jpeg,.png";
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB per file

/** Direct-to-blob upload: no file binary through server. Uses signed URL from /api/upload-url. Public store.
 * IMPORTANT: Use exact blob.url returned – do NOT modify. Pathname uses raw file.name (no transformation). */
async function uploadFileToBlob(file: File): Promise<string> {
  const pathname = `applications/${Date.now()}-${file.name}`;
  console.log("[upload] Starting upload:", file.name, file.size, "bytes →", pathname);
  try {
    const blob = await uploadToBlob(pathname, file, {
      access: "public",
      handleUploadUrl: "/api/upload-url",
      multipart: file.size > 4.5 * 1024 * 1024, // use multipart for files > 4.5MB
    });
    if (!blob?.url?.startsWith("https://")) throw new Error("Invalid blob URL");
    const fileUrl = blob.url; // DO NOT MODIFY – store and send exactly as returned
    console.log("[upload] Success:", fileUrl);
    return fileUrl;
  } catch (err) {
    console.error("[upload] Error:", err);
    throw err;
  }
}

export default function Apply() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadingField, setUploadingField] = useState<string | null>(null);
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      positionType: "Company Driver",
      experienceYears: 0,
      cdlType: "Class A CDL",
      hasCleanRecord: true,
      acceptTerms: false,
      driverLicenseFront: null,
      driverLicenseBack: null,
      medicalCard: null,
      resumes: [],
      annualTruckInspection: null,
      truckPicEngine: null,
      truckPicUnderEngine: null,
      truckPicTires: null,
      registrationCard: null,
    },
    mode: "onChange"
  });

  const mutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const fullName = [values.firstName, values.lastName].filter(Boolean).join(' ').trim();

      // Build docUrls from URL strings (no file binaries – each file was uploaded separately to /api/upload)
      const docUrls: { url: string; section: string; name: string }[] = [];
      const addUrl = (val: unknown, section: string, name: string) => {
        if (val && typeof val === "string" && val.startsWith("http")) {
          docUrls.push({ url: val, section, name });
        }
      };
      addUrl(values.driverLicenseFront, "Driver License (Front)", "license-front");
      addUrl(values.driverLicenseBack, "Driver License (Back)", "license-back");
      addUrl(values.medicalCard, "Medical Card", "medical");
      addUrl(values.annualTruckInspection, "Annual truck inspection", "inspection");
      addUrl(values.truckPicEngine, "Truck picture (engine)", "truck-engine");
      addUrl(values.truckPicUnderEngine, "Truck picture (under engine)", "truck-under");
      addUrl(values.truckPicTires, "Truck picture (tires)", "truck-tires");
      addUrl(values.registrationCard, "Registration Card (CAP Card)", "registration");
      const resumes = Array.isArray(values.resumes) ? values.resumes : [];
      for (let i = 0; i < resumes.length; i++) {
        const r = resumes[i];
        const url = typeof r === "string" ? r : (r as { url?: string })?.url;
        if (url && typeof url === "string" && url.startsWith("http")) {
          docUrls.push({ url, section: "Resume", name: `resume-${i + 1}` });
        }
      }

      const body = {
        fullName,
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        phone: values.phone,
        positionType: values.positionType,
        experienceYears: values.experienceYears,
        hasCleanRecord: values.hasCleanRecord !== undefined ? values.hasCleanRecord : true,
        address: values.address || undefined,
        cdlType: values.cdlType || undefined,
        docUrls,
      };

      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(body),
        credentials: "include",
      });

      const text = await res.text();
      let json: { message?: string; details?: string } | null = null;
      if (text?.trim()) {
        try {
          json = JSON.parse(text);
        } catch {
          // ignore
        }
      }

      if (!res.ok) {
        const msg = json?.message ?? `Request failed (${res.status}). Please try again.`;
        const details = json?.details ? ` (${json.details})` : "";
        throw new Error(msg + details);
      }

      return json ?? {};
    },
    onSuccess: () => {
      toast({
        title: "Application Received!",
        description: "Thank you for applying to Butata LLC. Our recruiting team will review your application and contact you shortly.",
        duration: 5000,
      });
      setLocation("/");
    },
    onError: (error) => {
      toast({
        title: "Submission Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const nextStep = async () => {
    let fieldsToValidate: (keyof z.infer<typeof formSchema>)[] = [];
    if (currentStep === 1) fieldsToValidate = ["firstName", "lastName", "email", "phone"];
    if (currentStep === 2) {
      fieldsToValidate = ["experienceYears"];
      const acceptTerms = form.getValues("acceptTerms");
      if (!acceptTerms) {
        toast({
          title: "Terms required",
          description: "You must accept the terms and conditions to continue.",
          variant: "destructive",
        });
        return;
      }
    }

    const isValid = await form.trigger(fieldsToValidate);
    if (isValid) setCurrentStep((prev) => prev + 1);
  };

  const prevStep = () => setCurrentStep((prev) => prev - 1);

  const setSingleFile = useCallback(async (
    field: "driverLicenseFront" | "driverLicenseBack" | "medicalCard" | "annualTruckInspection" | "truckPicEngine" | "truckPicUnderEngine" | "truckPicTires" | "registrationCard",
    file: File | null
  ) => {
    if (!file) {
      form.setValue(field, null);
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      toast({ title: "File too large", description: `${file.name} exceeds 10MB`, variant: "destructive" });
      return;
    }
    setUploadingField(field);
    try {
      const url = await uploadFileToBlob(file);
      form.setValue(field, url);
      toast({ title: "Uploaded", description: file.name, duration: 2000 });
    } catch (err) {
      console.error("[setSingleFile] Error:", err);
      toast({
        title: "Upload failed",
        description: err instanceof Error ? err.message : "Please try again",
        variant: "destructive",
      });
    } finally {
      setUploadingField(null);
    }
  }, [form, toast]);

  const handleFileInputChange = useCallback((
    field: "driverLicenseFront" | "driverLicenseBack" | "medicalCard" | "annualTruckInspection" | "truckPicEngine" | "truckPicUnderEngine" | "truckPicTires" | "registrationCard",
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSingleFile(field, file).catch((err) => {
      console.error("[handleFileInputChange] Unhandled:", err);
    });
    e.target.value = ""; // reset so same file can be re-selected
  }, [setSingleFile]);

  const addFiles = useCallback(async (files: FileList | null) => {
    if (!files?.length) return;
    const maxSize = MAX_FILE_SIZE;
    const prev = (form.getValues("resumes") || []) as string[];
    const urls: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.size > maxSize) {
        toast({ title: "File too large", description: `${file.name} exceeds 10MB`, variant: "destructive" });
        continue;
      }
      setUploadingField(`resume-${i}`);
      try {
        const url = await uploadFileToBlob(file);
        urls.push(url);
      } catch (err) {
        toast({ title: "Upload failed", description: err instanceof Error ? err.message : file.name, variant: "destructive" });
      } finally {
        setUploadingField(null);
      }
    }
    if (urls.length) form.setValue("resumes", [...prev, ...urls]);
  }, [form, toast]);

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    mutation.mutate(data);
  };

  // Prevent ANY native form submit (Enter key, etc.) so only fetch is used.
  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // Submit only via this handler → fetch POST (never native GET).
  const handleSubmitClick = () => {
    form.handleSubmit(onSubmit)();
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <div className="pt-32 pb-12 bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-3xl font-display font-bold">Driver Application</h1>
          <p className="text-primary-foreground/70 mt-2">Join the elite fleet today</p>
        </div>
      </div>

      <div className="flex-1 max-w-3xl w-full mx-auto px-4 py-12">
        {/* Progress Steps */}
        <div className="flex justify-between mb-12 relative">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-border -z-10 -translate-y-1/2" />
          {steps.map((step) => (
            <div key={step.id} className="flex flex-col items-center bg-background px-2">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-300 ${currentStep >= step.id ? "bg-accent text-white" : "bg-muted text-muted-foreground"
                  }`}
              >
                {step.id}
              </div>
              <span className="text-xs font-medium mt-2 text-muted-foreground">{step.title}</span>
            </div>
          ))}
        </div>

        <div className="bg-card p-6 md:p-8 rounded-2xl shadow-lg border border-border">
          <form onSubmit={handleFormSubmit} noValidate>
            <AnimatePresence mode="wait">
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="space-y-4">
                    <div className="space-y-4">
                      <Label className="text-base">Target Position</Label>
                      <RadioGroup
                        defaultValue={form.watch("positionType")}
                        onValueChange={(val) => form.setValue("positionType", val)}
                        className="grid grid-cols-1 md:grid-cols-2 gap-4"
                      >
                        <div className="flex items-center space-x-2 border border-input rounded-md p-3 hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-accent/10">
                          <RadioGroupItem value="Company Driver" id="company" />
                          <Label htmlFor="company" className="cursor-pointer flex-1">Company Driver</Label>
                        </div>
                        <div className="flex items-center space-x-2 border border-input rounded-md p-3 hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-accent/10">
                          <RadioGroupItem value="Owner Operator" id="owner" />
                          <Label htmlFor="owner" className="cursor-pointer flex-1">Owner Operator</Label>
                        </div>
                        <div className="flex items-center space-x-2 border border-input rounded-md p-3 hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-accent/10">
                          <RadioGroupItem value="Investor" id="investor" />
                          <Label htmlFor="investor" className="cursor-pointer flex-1">Investor</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <Separator className="my-6" />

                    <h2 className="text-xl font-bold">Contact Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          placeholder=""
                          {...form.register("firstName")}
                          className={form.formState.errors.firstName ? "border-destructive" : ""}
                        />
                        {form.formState.errors.firstName && (
                          <p className="text-xs text-destructive">{form.formState.errors.firstName.message}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          placeholder=""
                          {...form.register("lastName")}
                          className={form.formState.errors.lastName ? "border-destructive" : ""}
                        />
                        {form.formState.errors.lastName && (
                          <p className="text-xs text-destructive">{form.formState.errors.lastName.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        placeholder=""
                        {...form.register("address")}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder=""
                          {...form.register("email")}
                          className={form.formState.errors.email ? "border-destructive" : ""}
                        />
                        {form.formState.errors.email && (
                          <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          placeholder=""
                          {...form.register("phone")}
                          className={form.formState.errors.phone ? "border-destructive" : ""}
                        />
                        {form.formState.errors.phone && (
                          <p className="text-xs text-destructive">{form.formState.errors.phone.message}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <Button type="button" onClick={nextStep}>Next Step</Button>
                  </div>
                </motion.div>
              )}

              {currentStep === 2 && form.watch("positionType") === "Owner Operator" && (
                <motion.div
                  key="step2-owner"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="space-y-5">
                    <h2 className="text-xl font-bold">Owner Operator – Documents & Truck</h2>

                    <div className="space-y-2">
                      <Label>Driver License (Both Sides)</Label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex items-center gap-2">
                          <Input type="file" accept={ACCEPTED_TYPES} className="hidden" id="dlFront-oo" onChange={(e) => handleFileInputChange("driverLicenseFront", e)} />
                          <Button type="button" variant="outline" size="sm" onClick={() => document.getElementById("dlFront-oo")?.click()}>Choose file</Button>
                          <span className="text-sm text-muted-foreground truncate max-w-[120px]">
                            {uploadingField === "driverLicenseFront" ? (
                              <span className="text-emerald-600 dark:text-emerald-500">Uploading file... Please wait.</span>
                            ) : form.watch("driverLicenseFront") ? "Uploaded" : "File not selected"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Input type="file" accept={ACCEPTED_TYPES} className="hidden" id="dlBack-oo" onChange={(e) => handleFileInputChange("driverLicenseBack", e)} />
                          <Button type="button" variant="outline" size="sm" onClick={() => document.getElementById("dlBack-oo")?.click()}>Choose file</Button>
                          <span className="text-sm text-muted-foreground truncate max-w-[120px]">
                            {uploadingField === "driverLicenseBack" ? (
                              <span className="text-emerald-600 dark:text-emerald-500">Uploading file... Please wait.</span>
                            ) : form.watch("driverLicenseBack") ? "Uploaded" : "File not selected"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Medical Card</Label>
                      <div className="flex items-center gap-2">
                        <Input type="file" accept={ACCEPTED_TYPES} className="hidden" id="medicalCard-oo" onChange={(e) => handleFileInputChange("medicalCard", e)} />
                        <Button type="button" variant="outline" size="sm" onClick={() => document.getElementById("medicalCard-oo")?.click()}>Choose file</Button>
                        <span className="text-sm text-muted-foreground">
                          {uploadingField === "medicalCard" ? (
                            <span className="text-emerald-600 dark:text-emerald-500">Uploading file... Please wait.</span>
                          ) : form.watch("medicalCard") ? "Uploaded" : "File not selected"}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Annual truck inspection</Label>
                      <div className="flex items-center gap-2">
                        <Input type="file" accept={ACCEPTED_TYPES} className="hidden" id="annualInspection" onChange={(e) => handleFileInputChange("annualTruckInspection", e)} />
                        <Button type="button" variant="outline" size="sm" onClick={() => document.getElementById("annualInspection")?.click()}>Choose file</Button>
                        <span className="text-sm text-muted-foreground">
                          {uploadingField === "annualTruckInspection" ? (
                            <span className="text-emerald-600 dark:text-emerald-500">Uploading file... Please wait.</span>
                          ) : form.watch("annualTruckInspection") ? "Uploaded" : "File not selected"}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Please upload truck pictures (engine, under engine, tires)</Label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="space-y-1">
                          <span className="text-xs text-muted-foreground">Engine</span>
                          <div className="flex items-center gap-2">
                            <Input type="file" accept={ACCEPTED_TYPES} className="hidden" id="truckEngine" onChange={(e) => handleFileInputChange("truckPicEngine", e)} />
                            <Button type="button" variant="outline" size="sm" onClick={() => document.getElementById("truckEngine")?.click()}>Choose file</Button>
                            <span className="text-sm text-muted-foreground truncate max-w-[100px]">
                              {uploadingField === "truckPicEngine" ? (
                                <span className="text-emerald-600 dark:text-emerald-500">Uploading file... Please wait.</span>
                              ) : form.watch("truckPicEngine") ? "Uploaded" : "File not selected"}
                            </span>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <span className="text-xs text-muted-foreground">Under engine</span>
                          <div className="flex items-center gap-2">
                            <Input type="file" accept={ACCEPTED_TYPES} className="hidden" id="truckUnder" onChange={(e) => handleFileInputChange("truckPicUnderEngine", e)} />
                            <Button type="button" variant="outline" size="sm" onClick={() => document.getElementById("truckUnder")?.click()}>Choose file</Button>
                            <span className="text-sm text-muted-foreground truncate max-w-[100px]">
                              {uploadingField === "truckPicUnderEngine" ? (
                                <span className="text-emerald-600 dark:text-emerald-500">Uploading file... Please wait.</span>
                              ) : form.watch("truckPicUnderEngine") ? "Uploaded" : "File not selected"}
                            </span>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <span className="text-xs text-muted-foreground">Tires</span>
                          <div className="flex items-center gap-2">
                            <Input type="file" accept={ACCEPTED_TYPES} className="hidden" id="truckTires" onChange={(e) => handleFileInputChange("truckPicTires", e)} />
                            <Button type="button" variant="outline" size="sm" onClick={() => document.getElementById("truckTires")?.click()}>Choose file</Button>
                            <span className="text-sm text-muted-foreground truncate max-w-[100px]">
                              {uploadingField === "truckPicTires" ? (
                                <span className="text-emerald-600 dark:text-emerald-500">Uploading file... Please wait.</span>
                              ) : form.watch("truckPicTires") ? "Uploaded" : "File not selected"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 pt-2">
                      <Checkbox id="acceptTerms-oo" checked={!!form.watch("acceptTerms")} onCheckedChange={(checked) => form.setValue("acceptTerms", checked as boolean)} />
                      <Label htmlFor="acceptTerms-oo" className="font-normal cursor-pointer">Accept terms and conditions</Label>
                    </div>
                  </div>

                  <div className="flex justify-between pt-4">
                    <Button type="button" variant="outline" onClick={prevStep}>Back</Button>
                    <Button type="button" onClick={nextStep}>Next Step</Button>
                  </div>
                </motion.div>
              )}

              {currentStep === 2 && form.watch("positionType") === "Investor" && (
                <motion.div
                  key="step2-investor"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="space-y-5">
                    <h2 className="text-xl font-bold">Investor – Documents & Truck</h2>

                    <div className="space-y-2">
                      <Label>Registration Card (CAP Card)</Label>
                      <div className="flex items-center gap-2">
                        <Input type="file" accept={ACCEPTED_TYPES} className="hidden" id="registrationCard" onChange={(e) => handleFileInputChange("registrationCard", e)} />
                        <Button type="button" variant="outline" size="sm" onClick={() => document.getElementById("registrationCard")?.click()}>Choose file</Button>
                        <span className="text-sm text-muted-foreground">
                          {uploadingField === "registrationCard" ? (
                            <span className="text-emerald-600 dark:text-emerald-500">Uploading file... Please wait.</span>
                          ) : form.watch("registrationCard") ? "Uploaded" : "File not selected"}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Annual truck inspection</Label>
                      <div className="flex items-center gap-2">
                        <Input type="file" accept={ACCEPTED_TYPES} className="hidden" id="annualInspection-inv" onChange={(e) => handleFileInputChange("annualTruckInspection", e)} />
                        <Button type="button" variant="outline" size="sm" onClick={() => document.getElementById("annualInspection-inv")?.click()}>Choose file</Button>
                        <span className="text-sm text-muted-foreground">
                          {uploadingField === "annualTruckInspection" ? (
                            <span className="text-emerald-600 dark:text-emerald-500">Uploading file... Please wait.</span>
                          ) : form.watch("annualTruckInspection") ? "Uploaded" : "File not selected"}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Please upload truck pictures (engine, under engine, tires)</Label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="space-y-1">
                          <span className="text-xs text-muted-foreground">Engine</span>
                          <div className="flex items-center gap-2">
                            <Input type="file" accept={ACCEPTED_TYPES} className="hidden" id="truckEngine-inv" onChange={(e) => handleFileInputChange("truckPicEngine", e)} />
                            <Button type="button" variant="outline" size="sm" onClick={() => document.getElementById("truckEngine-inv")?.click()}>Choose file</Button>
                            <span className="text-sm text-muted-foreground truncate max-w-[100px]">
                              {uploadingField === "truckPicEngine" ? (
                                <span className="text-emerald-600 dark:text-emerald-500">Uploading file... Please wait.</span>
                              ) : form.watch("truckPicEngine") ? "Uploaded" : "File not selected"}
                            </span>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <span className="text-xs text-muted-foreground">Under engine</span>
                          <div className="flex items-center gap-2">
                            <Input type="file" accept={ACCEPTED_TYPES} className="hidden" id="truckUnder-inv" onChange={(e) => handleFileInputChange("truckPicUnderEngine", e)} />
                            <Button type="button" variant="outline" size="sm" onClick={() => document.getElementById("truckUnder-inv")?.click()}>Choose file</Button>
                            <span className="text-sm text-muted-foreground truncate max-w-[100px]">
                              {uploadingField === "truckPicUnderEngine" ? (
                                <span className="text-emerald-600 dark:text-emerald-500">Uploading file... Please wait.</span>
                              ) : form.watch("truckPicUnderEngine") ? "Uploaded" : "File not selected"}
                            </span>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <span className="text-xs text-muted-foreground">Tires</span>
                          <div className="flex items-center gap-2">
                            <Input type="file" accept={ACCEPTED_TYPES} className="hidden" id="truckTires-inv" onChange={(e) => handleFileInputChange("truckPicTires", e)} />
                            <Button type="button" variant="outline" size="sm" onClick={() => document.getElementById("truckTires-inv")?.click()}>Choose file</Button>
                            <span className="text-sm text-muted-foreground truncate max-w-[100px]">
                              {uploadingField === "truckPicTires" ? (
                                <span className="text-emerald-600 dark:text-emerald-500">Uploading file... Please wait.</span>
                              ) : form.watch("truckPicTires") ? "Uploaded" : "File not selected"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 pt-2">
                      <Checkbox id="acceptTerms-inv" checked={!!form.watch("acceptTerms")} onCheckedChange={(checked) => form.setValue("acceptTerms", checked as boolean)} />
                      <Label htmlFor="acceptTerms-inv" className="font-normal cursor-pointer">Accept terms and conditions</Label>
                    </div>
                  </div>

                  <div className="flex justify-between pt-4">
                    <Button type="button" variant="outline" onClick={prevStep}>Back</Button>
                    <Button type="button" onClick={nextStep}>Next Step</Button>
                  </div>
                </motion.div>
              )}

              {currentStep === 2 && form.watch("positionType") === "Company Driver" && (
                <motion.div
                  key="step2-company"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="space-y-5">
                    <h2 className="text-xl font-bold">Experience & License</h2>

                    <div className="space-y-2">
                      <Label htmlFor="cdlType">Choose your CDL type</Label>
                      <select
                        id="cdlType"
                        {...form.register("cdlType")}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      >
                        <option value="Class A CDL">Class A CDL</option>
                        <option value="Class B CDL">Class B CDL</option>
                        <option value="Class C CDL">Class C CDL</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="experience">Years of commercial driving experience?</Label>
                      <Input
                        id="experience"
                        type="number"
                        min="0"
                        placeholder="Years of commercial driving experience?"
                        {...form.register("experienceYears")}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Driver License (Both Sides)</Label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex items-center gap-2">
                          <Input
                            type="file"
                            accept={ACCEPTED_TYPES}
                            className="hidden"
                            id="driverLicenseFront"
                            onChange={(e) => handleFileInputChange("driverLicenseFront", e)}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => document.getElementById("driverLicenseFront")?.click()}
                          >
                            Choose file
                          </Button>
                          <span className="text-sm text-muted-foreground truncate max-w-[120px]">
                            {uploadingField === "driverLicenseFront" ? (
                              <span className="text-emerald-600 dark:text-emerald-500">Uploading file... Please wait.</span>
                            ) : form.watch("driverLicenseFront") ? "Uploaded" : "File not selected"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Input
                            type="file"
                            accept={ACCEPTED_TYPES}
                            className="hidden"
                            id="driverLicenseBack"
                            onChange={(e) => handleFileInputChange("driverLicenseBack", e)}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => document.getElementById("driverLicenseBack")?.click()}
                          >
                            Choose file
                          </Button>
                          <span className="text-sm text-muted-foreground truncate max-w-[120px]">
                            {uploadingField === "driverLicenseBack" ? (
                              <span className="text-emerald-600 dark:text-emerald-500">Uploading file... Please wait.</span>
                            ) : form.watch("driverLicenseBack") ? "Uploaded" : "File not selected"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Medical Card</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          type="file"
                          accept={ACCEPTED_TYPES}
                          className="hidden"
                          id="medicalCard"
                          onChange={(e) => handleFileInputChange("medicalCard", e)}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => document.getElementById("medicalCard")?.click()}
                        >
                          Choose file
                        </Button>
                        <span className="text-sm text-muted-foreground">
                          {uploadingField === "medicalCard" ? (
                            <span className="text-emerald-600 dark:text-emerald-500">Uploading file... Please wait.</span>
                          ) : form.watch("medicalCard") ? "Uploaded" : "File not selected"}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="resume">Resume / Document (Optional)</Label>
                      <Input
                        id="resume"
                        type="file"
                        className="hidden"
                        accept={ACCEPTED_TYPES}
                        multiple
                        onChange={(e) => {
                          addFiles(e.target.files).catch((err) => console.error("[resume addFiles] Unhandled:", err));
                          e.target.value = "";
                        }}
                      />
                      <div
                        role="button"
                        tabIndex={0}
                        onClick={() => document.getElementById("resume")?.click()}
                        onKeyDown={(e) => e.key === "Enter" && document.getElementById("resume")?.click()}
                        onDragOver={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setIsDragging(true);
                        }}
                        onDragLeave={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setIsDragging(false);
                        }}
                        onDrop={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setIsDragging(false);
                          addFiles(e.dataTransfer.files).catch((err) => console.error("[resume drop addFiles] Unhandled:", err));
                        }}
                        className={`flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed p-6 transition-colors cursor-pointer min-h-[120px] ${
                          isDragging
                            ? "border-primary bg-primary/5"
                            : "border-muted-foreground/30 bg-muted/30 hover:border-primary/50 hover:bg-muted/50"
                        }`}
                      >
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Upload className="h-6 w-6" />
                          {uploadingField?.startsWith("resume-") ? (
                            <span className="text-sm text-emerald-600 dark:text-emerald-500">Uploading file... Please wait.</span>
                          ) : (
                            <span className="text-sm">to upload or drag and drop</span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">PDF, JPEG, JPG, PNG (Max 10MB)</p>
                        {((form.watch("resumes") || []) as string[]).length > 0 && (
                          <div className="flex flex-wrap gap-2 justify-center mt-2">
                            {((form.watch("resumes") || []) as string[]).map((url, i) => (
                              <div
                                key={i}
                                className="relative group rounded border bg-background p-1 shadow-sm"
                                onClick={(e) => e.stopPropagation()}
                              >
                                {url.match(/\.(jpg|jpeg|png|gif|webp)(\?|$)/i) ? (
                                  <img
                                    src={url}
                                    alt={`Resume ${i + 1}`}
                                    className="h-16 w-20 object-cover rounded"
                                  />
                                ) : (
                                  <div className="h-16 w-20 flex items-center justify-center rounded bg-muted">
                                    <FileText className="h-8 w-8 text-muted-foreground" />
                                  </div>
                                )}
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="sm"
                                  className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const list = (form.getValues("resumes") || []) as string[];
                                    form.setValue("resumes", list.filter((_, j) => j !== i));
                                  }}
                                >
                                  ×
                                </Button>
                                <span className="block text-[10px] truncate max-w-[80px] mt-0.5">Resume {i + 1}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 pt-2">
                      <Checkbox
                        id="acceptTerms"
                        checked={!!form.watch("acceptTerms")}
                        onCheckedChange={(checked) => form.setValue("acceptTerms", checked as boolean)}
                      />
                      <Label htmlFor="acceptTerms" className="font-normal cursor-pointer">
                        Accept terms and conditions
                      </Label>
                    </div>
                  </div>

                  <div className="flex justify-between pt-4">
                    <Button type="button" variant="outline" onClick={prevStep}>Back</Button>
                    <Button type="button" onClick={nextStep}>Next Step</Button>
                  </div>
                </motion.div>
              )}

              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="space-y-4">
                    <h2 className="text-xl font-bold">Review Application</h2>

                    <div className="bg-muted/30 p-4 rounded-lg space-y-3 text-sm">
                      <div className="grid grid-cols-2">
                        <span className="text-muted-foreground">Position:</span>
                        <span className="font-medium text-right text-primary">{form.getValues("positionType")}</span>
                      </div>
                      <Separator />
                      <div className="grid grid-cols-2">
                        <span className="text-muted-foreground">Name:</span>
                        <span className="font-medium text-right">{form.getValues("firstName")} {form.getValues("lastName")}</span>
                      </div>
                      <Separator />
                      {form.getValues("address") && (
                        <>
                          <div className="grid grid-cols-2">
                            <span className="text-muted-foreground">Address:</span>
                            <span className="font-medium text-right">{form.getValues("address")}</span>
                          </div>
                          <Separator />
                        </>
                      )}
                      <div className="grid grid-cols-2">
                        <span className="text-muted-foreground">Email:</span>
                        <span className="font-medium text-right">{form.getValues("email")}</span>
                      </div>
                      <Separator />
                      <div className="grid grid-cols-2">
                        <span className="text-muted-foreground">Phone:</span>
                        <span className="font-medium text-right">{form.getValues("phone")}</span>
                      </div>
                      {form.getValues("positionType") === "Company Driver" && (
                        <>
                          <Separator />
                          <div className="grid grid-cols-2">
                            <span className="text-muted-foreground">Experience:</span>
                            <span className="font-medium text-right">{form.getValues("experienceYears")} Years</span>
                          </div>
                        </>
                      )}
                      {form.getValues("cdlType") && form.getValues("positionType") === "Company Driver" && (
                        <>
                          <Separator />
                          <div className="grid grid-cols-2">
                            <span className="text-muted-foreground">CDL Type:</span>
                            <span className="font-medium text-right">{form.getValues("cdlType")}</span>
                          </div>
                        </>
                      )}
                      {(form.getValues("driverLicenseFront") || form.getValues("driverLicenseBack")) && (
                        <>
                          <Separator />
                          <div className="grid grid-cols-2">
                            <span className="text-muted-foreground">Driver License:</span>
                            <span className="font-medium text-right">
                              {[form.getValues("driverLicenseFront"), form.getValues("driverLicenseBack")].filter(Boolean).length ? "Uploaded" : ""}
                            </span>
                          </div>
                        </>
                      )}
                      {form.getValues("medicalCard") && (
                        <>
                          <Separator />
                          <div className="grid grid-cols-2">
                            <span className="text-muted-foreground">Medical Card:</span>
                            <span className="font-medium text-right">Uploaded</span>
                          </div>
                        </>
                      )}
                      {form.getValues("registrationCard") && (
                        <>
                          <Separator />
                          <div className="grid grid-cols-2">
                            <span className="text-muted-foreground">Registration Card (CAP Card):</span>
                            <span className="font-medium text-right">Uploaded</span>
                          </div>
                        </>
                      )}
                      {form.getValues("annualTruckInspection") && (
                        <>
                          <Separator />
                          <div className="grid grid-cols-2">
                            <span className="text-muted-foreground">Annual truck inspection:</span>
                            <span className="font-medium text-right">Uploaded</span>
                          </div>
                        </>
                      )}
                      {(form.getValues("truckPicEngine") || form.getValues("truckPicUnderEngine") || form.getValues("truckPicTires")) && (
                        <>
                          <Separator />
                          <div className="grid grid-cols-2">
                            <span className="text-muted-foreground">Truck pictures:</span>
                            <span className="font-medium text-right">Uploaded</span>
                          </div>
                        </>
                      )}
                    </div>

                    <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 rounded-lg text-sm">
                      <CheckCircle className="w-5 h-5 shrink-0" />
                      <p>By submitting this application, I certify that the information provided is true and complete to the best of my knowledge.</p>
                    </div>
                  </div>

                  <div className="flex justify-between pt-4">
                    <Button type="button" variant="outline" onClick={prevStep}>Back</Button>
                    <Button type="button" className="bg-accent hover:bg-accent/90 w-32" disabled={mutation.isPending} onClick={handleSubmitClick}>
                      {mutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Submit"}
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </div>
      </div >

      <Footer />
    </div >
  );
}


