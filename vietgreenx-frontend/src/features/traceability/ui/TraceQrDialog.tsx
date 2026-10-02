"use client";

import { Download, QrCode } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import { useRef } from "react";

import type { AppLocale } from "@/shared/i18n/locale";
import { getClientLocale } from "@/shared/i18n/get-client-locale";
import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/dialog";

import { getTraceCopy } from "../trace.constants";
import { buildTraceUrl } from "./TraceTokenActions";

interface TraceQrDialogProps {
  token: string;
  locale?: AppLocale;
  trigger?: React.ReactNode;
}

export function TraceQrDialog({ token, locale = getClientLocale(), trigger }: TraceQrDialogProps) {
  const copy = getTraceCopy(locale).qr;
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const traceUrl = buildTraceUrl(token);

  const handleDownload = () => {
    if (!canvasRef.current) return;

    // Get the data URL from the canvas
    const dataUrl = canvasRef.current.toDataURL("image/png");

    // Create a temporary anchor to trigger download
    const anchor = document.createElement("a");
    anchor.href = dataUrl;
    anchor.download = `QR-${token.split("-")[0]}.png`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="gap-1.5">
            <QrCode className="size-3.5" />
            {copy.viewAndDownload}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{copy.title}</DialogTitle>
          <DialogDescription>{copy.dialogDescription}</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center space-y-6 rounded-lg bg-slate-50/50 p-6">
          <div className="rounded-xl border border-border bg-white p-4 shadow-sm">
            <QRCodeCanvas
              id="qr-canvas"
              ref={canvasRef}
              value={traceUrl}
              size={220}
              level="H"
              includeMargin={true}
            />
          </div>
          <p className="break-all px-4 text-center text-xs text-muted-foreground">{traceUrl}</p>
        </div>
        <DialogFooter className="sm:justify-end">
          <Button
            type="button"
            variant="outline"
            className="w-full gap-1.5 sm:w-auto"
            onClick={handleDownload}
          >
            <Download className="size-4" />
            {copy.download}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
