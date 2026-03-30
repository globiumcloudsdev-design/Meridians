"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Mail, CheckCircle, Users } from "lucide-react";
import Link from "next/link";

interface AlreadySubscribedModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AlreadySubscribedModal({ isOpen, onClose }: AlreadySubscribedModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md rounded-3xl border-primary/20 bg-card/95 backdrop-blur-xl">
        <DialogHeader className="text-center space-y-4">
          <div className="w-20 h-20 mx-auto bg-success/10 border-2 border-success/30 rounded-3xl flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-success" />
          </div>
          <DialogTitle className="text-2xl font-black bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
            Already Subscribed!
          </DialogTitle>
          <DialogDescription className="text-lg font-medium text-muted-foreground">
            You're already on our newsletter list. Stay tuned for the latest updates from Meridian&apos;s!
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div className="flex items-center gap-3 p-4 bg-primary/5 rounded-2xl border border-primary/10">
            <Mail className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-foreground">Exclusive updates delivered to your inbox</span>
          </div>
          <div className="pt-2 space-y-3">
            <DialogClose asChild>
              <Button
                variant="secondary"
                className="w-full h-14 rounded-2xl text-lg font-black border-2 border-muted-foreground/50 hover:border-primary hover:bg-primary/5 transition-all"
              >
                Close
              </Button>
            </DialogClose>
            
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

