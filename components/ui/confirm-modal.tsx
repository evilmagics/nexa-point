"use client";

import { Modal } from "@heroui/react";
import { Button } from "@/components/ui/button";

interface ConfirmModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  title: string;
  description: string;
  confirmText: string;
  onConfirm: () => void;
}

export function ConfirmModal({ isOpen, onOpenChange, title, description, confirmText, onConfirm }: ConfirmModalProps) {
  return (
    <Modal>
      <Modal.Backdrop 
        isOpen={isOpen} 
        onOpenChange={onOpenChange} 
        className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center backdrop-blur-sm"
      >
        <Modal.Container>
          <Modal.Dialog className="bg-[#090909] border border-border rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden outline-none">
            <Modal.Header className="px-6 py-5 border-b border-border/50 text-foreground font-heading font-medium text-lg">
              {title}
            </Modal.Header>
            <Modal.Body className="p-6 text-muted-foreground text-[15px] leading-relaxed">
              <p>{description}</p>
            </Modal.Body>
            <Modal.Footer className="px-6 py-4 border-t border-border/50 flex justify-end gap-3 bg-secondary/20">
              <Button variant="ghost" onClick={() => onOpenChange(false)} className="text-foreground rounded-full">
                Cancel
              </Button>
              <Button 
                onClick={onConfirm} 
                className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full shadow-[0_0_15px_-5px_rgba(0,153,255,0.5)] border-none"
              >
                {confirmText}
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
