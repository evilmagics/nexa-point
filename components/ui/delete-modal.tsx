"use client";

import { Modal } from "@heroui/react";
import { Button } from "@/components/ui/button";

interface DeleteModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  target: 'all' | string | null;
  onConfirm: () => void;
}

export function DeleteModal({ isOpen, onOpenChange, target, onConfirm }: DeleteModalProps) {
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
              {target === 'all' ? "Clear All History" : "Delete Chat"}
            </Modal.Header>
            <Modal.Body className="p-6 text-muted-foreground text-[15px] leading-relaxed">
              <p>
                {target === 'all' 
                  ? "Are you sure you want to delete all chat history? This action cannot be undone." 
                  : "Are you sure you want to delete this chat? This action cannot be undone."}
              </p>
            </Modal.Body>
            <Modal.Footer className="px-6 py-4 border-t border-border/50 flex justify-end gap-3 bg-secondary/20">
              <Button variant="ghost" onClick={() => onOpenChange(false)} className="text-foreground rounded-full">
                Cancel
              </Button>
              <Button 
                onClick={onConfirm} 
                className="bg-red-500 hover:bg-red-600 text-white rounded-full shadow-[0_0_15px_-5px_rgba(239,68,68,0.5)] border-none"
              >
                Delete
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
