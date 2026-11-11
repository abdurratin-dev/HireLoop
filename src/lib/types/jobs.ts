/**
 * Shared job domain types.
 *
 * These live outside any route file so pages, server actions and client
 * components can import them without reaching into `page.tsx` modules.
 */

/** Payload submitted by the "Post a New Job" form. */
export type FormState = {
  title: string;
  company: string;
  category: string;
  jobType: string;
  isRemote: boolean;
  location: string;
  deadline: string;
  minSalary: string;
  maxSalary: string;
  frequency: string;
  responsibilities: string;
  qualifications: string;
  applicants: number;
  postedAt: string;
};

/** Lifecycle of a listing, derived from its application deadline. */
export type JobStatus = "active" | "expired";

/** A stored job posting: the form payload plus its persisted id. */
export type JobPosting = FormState & {
  _id: string;
};
