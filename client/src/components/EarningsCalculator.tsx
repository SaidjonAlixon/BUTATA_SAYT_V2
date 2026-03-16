"use client";

import { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DollarSign } from "lucide-react";

const DISPATCH_FEE_PERCENT = 12;
const COMPANY_FEE = 550;

interface EarningsCalculatorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EarningsCalculator({ open, onOpenChange }: EarningsCalculatorProps) {
  const [gross, setGross] = useState("");
  const [fuel, setFuel] = useState("");
  const [tolls, setTolls] = useState("");

  const { dispatchFee, netIncome } = useMemo(() => {
    const g = parseFloat(gross) || 0;
    const f = parseFloat(fuel) || 0;
    const t = parseFloat(tolls) || 0;
    const dispatch = g * (DISPATCH_FEE_PERCENT / 100);
    const net = g === 0 ? 0 : g - dispatch - COMPANY_FEE - f - t;
    return { dispatchFee: dispatch, netIncome: net };
  }, [gross, fuel, tolls]);

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 }).format(n);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
        <DialogHeader>
          <DialogTitle className="text-xl font-display font-bold">Owner Operator Earnings Calculator</DialogTitle>
          <DialogDescription>Enter your weekly figures to estimate take-home pay.</DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-4">
          <div className="space-y-2">
            <Label htmlFor="gross">Gross revenue (weekly)</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <Input
                id="gross"
                type="number"
                placeholder="0"
                value={gross}
                onChange={(e) => setGross(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <div className="rounded-lg bg-slate-100 dark:bg-slate-800/50 p-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-600 dark:text-slate-400">Dispatch fee (12%)</span>
              <span className="font-mono font-medium">{formatCurrency(dispatchFee)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600 dark:text-slate-400">Company fee</span>
              <span className="font-mono font-medium">$550.00</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="fuel">Fuel</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <Input
                id="fuel"
                type="number"
                placeholder="0"
                value={fuel}
                onChange={(e) => setFuel(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tolls">Tolls</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <Input
                id="tolls"
                type="number"
                placeholder="0"
                value={tolls}
                onChange={(e) => setTolls(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <div className="rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 p-4">
            <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">Net income (weekly)</div>
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-500">
              {formatCurrency(netIncome)}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              Gross − dispatch (12%) − company fee ($550) − fuel − tolls
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
