import { Trash2 } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';

type ConfirmDeleteDialogProps = {
    title: string;
    description: string;
    confirmLabel?: string;
    triggerLabel?: string;
    onConfirm: () => void;
};

export function ConfirmDeleteDialog({
    title,
    description,
    confirmLabel = 'Eliminar',
    triggerLabel = 'Eliminar',
    onConfirm,
}: ConfirmDeleteDialogProps) {
    const [open, setOpen] = useState(false);

    function confirm() {
        onConfirm();
        setOpen(false);
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm" type="button" variant="destructive">
                    <Trash2 className="size-4" />
                    {triggerLabel}
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="outline">
                            Cancelar
                        </Button>
                    </DialogClose>
                    <Button
                        onClick={confirm}
                        type="button"
                        variant="destructive"
                    >
                        {confirmLabel}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
