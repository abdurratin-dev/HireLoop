"use client";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";
import type { JobPosting } from "@/lib/types/jobs";
import { toast } from "@/components/ui/toast";
import { deleteJob } from "@/lib/actions/api/jobs";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function DeleteJobButton({ job }: { job: JobPosting}) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const hendleDelete = async () => {
    const res = await deleteJob(job._id);
    console.log(res);
    if (res.deletedCount === 1) {
      setOpen(false);
      toast.add({
        title: "Job deleted",
        description: "The job have been parmanetly deleted",
      });
      router.refresh();
    }
  };
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger
        render={
          <button
            type="button"
            aria-label={`Delete ${job.title}`}
            className="grid size-8 place-items-center rounded-md border border-white/10 bg-white/[0.03] text-zinc-400 transition-colors hover:border-red-500/40 hover:text-red-400"
          >
            <Trash2 aria-hidden className="size-3.5" />
          </button>
        }
      />
      <AlertDialogContent className="sm:max-w-md">
        <div className="flex flex-col items-center justify-center gap-2 py-5">
          <Trash2 aria-hidden className="size-10 text-red-400" />
          <p>
            Are you sure <span className="text-red-400">Delete</span> the job.
          </p>
        </div>
        <AlertDialogFooter className="sm:justify-center">
          <AlertDialogCancel render={<Button type="button">Close</Button>} />
          <Button type="button" variant={"destructive"} onClick={hendleDelete}>
            <Trash2 aria-hidden className="size-3.5 text-red-400" />
            Delete
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
