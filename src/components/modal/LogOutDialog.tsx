import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

interface LogOutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LogOutDialog({ open, onOpenChange }: LogOutDialogProps) {
  const handleLogOut = () => {
    signOut({ callbackUrl: "/login" });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <LogOut className="h-5 w-5" />
            Sign Out
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to sign out? You will need to log in again to access your projects.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleLogOut}
            className="flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
