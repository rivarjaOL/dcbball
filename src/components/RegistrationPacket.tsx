import {
  ArrowLeft,
  ArrowRight,
  Check,
  ClipboardList,
  Edit3,
  Loader2,
  Send,
  ShieldCheck,
  Trophy,
  User,
  Users,
} from "lucide-react";
import {
  type FormEvent,
  type MouseEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

export type ProgramPackageId = "early" | "standard" | "weekly";

type StepId = "athlete" | "parent" | "program" | "waiver" | "review";

type RegistrationFormState = {
  email: string;
  athleteName: string;
  athletePhone: string;
  athleteDob: string;
  athleteGrade: string;
  athleteAge: string;
  athleteMeasurements: string;
  shirtSize: string;
  parentName: string;
  parentAddress: string;
  parentEmail: string;
  parentPhone: string;
  emergencyName: string;
  emergencyPhone: string;
  skillLevel: string;
  heardFrom: string;
  membershipStatus: string;
  facilityLocation: string;
  packageChoice: ProgramPackageId;
  waiverAccepted: boolean;
  siblingDiscountName: string;
  digitalSignature: string;
  dateSigned: string;
};

type FieldErrors = Partial<Record<keyof RegistrationFormState, string>>;

type RegistrationPacketProps = {
  selectedPackage?: ProgramPackageId;
  intentKey?: number;
};

const GOOGLE_FORM_ENDPOINT =
  "https://docs.google.com/forms/d/e/1FAIpQLScf7b9ChwsWEaoNOaeRpKzCMW6LctFmk-TXeEe1Z5McnMx2iQ/formResponse";

const GOOGLE_IFRAME_NAME = "workhouse-google-form-target";
const STORAGE_KEY = "workhouse-summer-registration-draft";

const SHIRT_SIZES = ["Adult XS", "Adult S", "Adult M", "Adult L", "Adult XL"];
const GRADES = Array.from({ length: 12 }, (_, index) => String(index + 1));
const SKILL_LEVELS = ["Beginner", "Intermediate", "Advanced", "Pro"];
const HEARD_FROM = [
  "Executive Health Club",
  "Word of Mouth",
  "Social Media",
  "Other",
];

const MEMBERSHIP_OPTIONS = [
  {
    value: "YES, HAVE A CURRENT MEMBERSHIP",
    label: "Current member",
    detail: "The athlete already has an active family Executive Health Club membership.",
  },
  {
    value: "NO, BUT WILL GET A 3 MONTH MEMBERSHIP FOR THE SUMMER PROGRAM",
    label: "Need summer membership",
    detail: "You will set up the 3-month summer membership before sessions begin.",
  },
  {
    value:
      "DO NOT WANT A MEMBERSHIP, BUT WILL PAY THE ADDED WEEKLY FEE $40 (FOR WEEKLY REGISTRATIONS)",
    label: "Weekly fee instead",
    detail: "For weekly registrations only, add the $40 weekly facility fee.",
  },
];

const FACILITY_LOCATION = "Manchester Facility: Executive Health and Sports Club";

const PACKAGE_OPTIONS: Array<{
  id: ProgramPackageId;
  label: string;
  price: string;
  kicker: string;
  detail: string;
  googleValue: string;
}> = [
  {
    id: "standard",
    label: "Standard Full Program",
    price: "$4,000",
    kicker: "Standard rate",
    detail: "Full Warrior program at the standard summer rate.",
    googleValue:
      "WARRIOR Program (Ages 13 & Up) from 5 am to 9 am runs 6/8 to 8/14 (3 months).... After May 1st Total $4,000",
  },
  {
    id: "weekly",
    label: "Weekly Registration",
    price: "$550 / week",
    kicker: "Flexible",
    detail: "Individual week registration. Facility surcharge may apply.",
    googleValue:
      "WARRIOR Program (Ages 13 & Up) from 5 am to 9 am  (weekly cost) $550",
  },
];

const STEPS: Array<{
  id: StepId;
  label: string;
  shortLabel: string;
  icon: typeof User;
}> = [
  { id: "athlete", label: "Athlete", shortLabel: "Player info", icon: User },
  { id: "parent", label: "Contacts", shortLabel: "Family + emergency", icon: Users },
  { id: "program", label: "Program", shortLabel: "Package choices", icon: Trophy },
  { id: "waiver", label: "Waiver", shortLabel: "Agreement", icon: ShieldCheck },
  { id: "review", label: "Review", shortLabel: "Ready to send", icon: ClipboardList },
];

const WAIVER_TEXT = [
  "I, the undersigned, as parent or Legal Guardian of the above mentioned participant, indicate by legal signature below that I am in agreement with the following articles.",
  "The participant is enrolled no younger than 5 years old.",
  "The participant is physically fit and permission is granted for his or her participation in the David Cooper Basketball Training Program.",
  "There is secondary insurance and it is included in the Program fees at the time of registration. A deductible on claims for injuries may be applicable.",
  "If injured, said participant will be taken to the nearest medical facility for treatment unless I or another family member am present and personally take said participant to another facility.",
  "No David Cooper Basketball Trainer, Officer/Director, Coach, or other official shall be held liable for any injuries sustained to any participant in any basketball activity.",
  "In the event any participant is issued a uniform or other piece of equipment, I understand that I shall be liable for its replacement in the event of loss or damage.",
  "I recognize my responsibility to behave in a sportsmanlike manner, and will encourage participants and others around me to do the same.",
];

function todayInputValue() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

function initialFormState(): RegistrationFormState {
  return {
    email: "",
    athleteName: "",
    athletePhone: "",
    athleteDob: "",
    athleteGrade: "",
    athleteAge: "",
    athleteMeasurements: "",
    shirtSize: "",
    parentName: "",
    parentAddress: "",
    parentEmail: "",
    parentPhone: "",
    emergencyName: "",
    emergencyPhone: "",
    skillLevel: "",
    heardFrom: "",
    membershipStatus: "",
    facilityLocation: FACILITY_LOCATION,
    packageChoice: "standard",
    waiverAccepted: false,
    siblingDiscountName: "",
    digitalSignature: "",
    dateSigned: todayInputValue(),
  };
}

function loadDraft(): RegistrationFormState {
  if (typeof window === "undefined") return initialFormState();

  try {
    const draft = window.sessionStorage.getItem(STORAGE_KEY);
    if (!draft) return initialFormState();
    const parsed = JSON.parse(draft) as Partial<RegistrationFormState>;
    return {
      ...initialFormState(),
      ...parsed,
      packageChoice:
        parsed.packageChoice === "early" ? "standard" : parsed.packageChoice ?? "standard",
    };
  } catch {
    return initialFormState();
  }
}

function isBlank(value: string) {
  return value.trim().length === 0;
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function addRequired(
  errors: FieldErrors,
  form: RegistrationFormState,
  field: keyof RegistrationFormState,
  label: string,
) {
  if (typeof form[field] === "string" && isBlank(form[field] as string)) {
    errors[field] = `${label} is required.`;
  }
}

function validateStep(step: StepId, form: RegistrationFormState): FieldErrors {
  const errors: FieldErrors = {};

  if (step === "athlete") {
    addRequired(errors, form, "email", "Email");
    addRequired(errors, form, "athleteName", "Athlete name");
    addRequired(errors, form, "athletePhone", "Athlete phone");
    addRequired(errors, form, "athleteDob", "Date of birth");
    addRequired(errors, form, "athleteGrade", "Grade");
    addRequired(errors, form, "athleteAge", "Age");
    addRequired(errors, form, "athleteMeasurements", "Weight and height");
    addRequired(errors, form, "shirtSize", "Shirt size");

    if (form.email && !isValidEmail(form.email)) {
      errors.email = "Enter a valid email address.";
    }
    if (form.athleteAge && Number(form.athleteAge) < 5) {
      errors.athleteAge = "Athlete must be at least 5 years old.";
    }
  }

  if (step === "parent") {
    addRequired(errors, form, "parentName", "Parent / guardian name");
    addRequired(errors, form, "parentAddress", "Parent address");
    addRequired(errors, form, "parentEmail", "Parent / guardian email");
    addRequired(errors, form, "parentPhone", "Parent / guardian phone");
    addRequired(errors, form, "emergencyName", "Emergency contact name");
    addRequired(errors, form, "emergencyPhone", "Emergency contact phone");

    if (form.parentEmail && !isValidEmail(form.parentEmail)) {
      errors.parentEmail = "Enter a valid parent / guardian email.";
    }
  }

  if (step === "program") {
    addRequired(errors, form, "skillLevel", "Skill level");
    addRequired(errors, form, "heardFrom", "How you heard about us");
    addRequired(errors, form, "membershipStatus", "Membership status");
    addRequired(errors, form, "facilityLocation", "Facility location");
  }

  if (step === "waiver") {
    if (!form.waiverAccepted) {
      errors.waiverAccepted = "The waiver agreement is required.";
    }
    addRequired(errors, form, "digitalSignature", "Digital signature");
    addRequired(errors, form, "dateSigned", "Date signed");
  }

  return errors;
}

function validateAll(form: RegistrationFormState) {
  return {
    ...validateStep("athlete", form),
    ...validateStep("parent", form),
    ...validateStep("program", form),
    ...validateStep("waiver", form),
  };
}

function splitDate(value: string) {
  const [year, month, day] = value.split("-");
  return {
    year,
    month: String(Number(month)),
    day: String(Number(day)),
  };
}

function appendGoogleDate(body: URLSearchParams, entryId: string, value: string) {
  const date = splitDate(value);
  body.set(`entry.${entryId}_year`, date.year);
  body.set(`entry.${entryId}_month`, date.month);
  body.set(`entry.${entryId}_day`, date.day);
}

function buildGooglePayload(form: RegistrationFormState) {
  const packageChoice =
    form.packageChoice === "early" ? "standard" : form.packageChoice;
  const selectedPackage = PACKAGE_OPTIONS.find(
    (option) => option.id === packageChoice,
  );
  const body = new URLSearchParams();

  body.set("emailAddress", form.email.trim());
  body.set("entry.872068080", form.athleteName.trim());
  body.set("entry.733704427", form.athletePhone.trim());
  appendGoogleDate(body, "267800569", form.athleteDob);
  body.set("entry.725928791", form.athleteGrade);
  body.set("entry.26880386", form.athleteAge.trim());
  body.set("entry.1580715561", form.athleteMeasurements.trim());
  body.set("entry.1604730758", form.shirtSize);
  body.set("entry.1075646401", form.parentName.trim());
  body.set("entry.1597981793", form.parentAddress.trim());
  body.set("entry.671508524", form.parentEmail.trim());
  body.set("entry.1471059841", form.parentPhone.trim());
  body.set("entry.449465271", form.emergencyName.trim());
  body.set("entry.105709177", form.emergencyPhone.trim());
  body.set("entry.430059934", form.skillLevel);
  body.set("entry.285169857", form.heardFrom);
  body.set("entry.318356955", form.membershipStatus);
  body.set("entry.115424816", form.facilityLocation);
  body.set("entry.1351164016", selectedPackage?.googleValue ?? "");
  body.set("entry.578812469", "I have read and agree to the terms.");
  body.set("entry.500454811", form.siblingDiscountName.trim());
  body.set("entry.367574461", form.digitalSignature.trim());
  appendGoogleDate(body, "1071552387", form.dateSigned);
  body.set("pageHistory", "0");
  body.set("fvv", "1");
  body.set("submit", "Submit");

  return body;
}

function countStepAnswers(step: StepId, form: RegistrationFormState) {
  const groups: Record<StepId, Array<keyof RegistrationFormState>> = {
    athlete: [
      "email",
      "athleteName",
      "athletePhone",
      "athleteDob",
      "athleteGrade",
      "athleteAge",
      "athleteMeasurements",
      "shirtSize",
    ],
    parent: [
      "parentName",
      "parentAddress",
      "parentEmail",
      "parentPhone",
      "emergencyName",
      "emergencyPhone",
    ],
    program: ["skillLevel", "heardFrom", "membershipStatus", "facilityLocation"],
    waiver: ["digitalSignature", "dateSigned"],
    review: [],
  };

  if (step === "review") return { answered: 0, total: 0 };

  const total = groups[step].length + (step === "waiver" ? 1 : 0);
  const answered =
    groups[step].filter((field) => {
      const value = form[field];
      return typeof value === "string" && !isBlank(value);
    }).length + (step === "waiver" && form.waiverAccepted ? 1 : 0);

  return { answered, total };
}

const fieldBase =
  "w-full border-2 border-ink bg-bone px-4 py-3 font-ui text-base text-ink outline-none transition-colors placeholder:text-ink/35 focus:border-orange focus:ring-0";

function FieldShell({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block min-w-0">
      <span className="mb-2 block font-mono-display text-[11px] uppercase tracking-[0.22em] text-ink/70">
        {label}
      </span>
      {children}
      {error && (
        <span className="mt-2 block font-ui text-sm font-semibold text-orange">
          {error}
        </span>
      )}
    </label>
  );
}

function TextField({
  label,
  value,
  error,
  type = "text",
  placeholder,
  inputMode,
  onChange,
}: {
  label: string;
  value: string;
  error?: string;
  type?: string;
  placeholder?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  onChange: (value: string) => void;
}) {
  return (
    <FieldShell label={label} error={error}>
      <input
        type={type}
        value={value}
        inputMode={inputMode}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className={`${fieldBase} ${error ? "border-orange" : ""}`}
      />
    </FieldShell>
  );
}

function SelectField({
  label,
  value,
  error,
  placeholder,
  options,
  onChange,
}: {
  label: string;
  value: string;
  error?: string;
  placeholder: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <FieldShell label={label} error={error}>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={`${fieldBase} appearance-none ${error ? "border-orange" : ""}`}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </FieldShell>
  );
}

function ChoiceGrid({
  options,
  value,
  error,
  onChange,
}: {
  options: Array<{ value: string; label: string; detail?: string; price?: string }>;
  value: string;
  error?: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <div className="grid gap-3">
        {options.map((option) => {
          const selected = value === option.value;
          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(option.value)}
              className={`border-2 p-4 text-left transition-all ${
                selected
                  ? "border-ink bg-orange text-ink shadow-[5px_5px_0_0_hsl(var(--ink))]"
                  : "border-ink bg-bone text-ink hover:-translate-y-0.5 hover:shadow-[4px_4px_0_0_hsl(var(--ink))]"
              }`}
            >
              <span className="flex items-start justify-between gap-4">
                <span>
                  <span className="block font-display text-2xl uppercase leading-none">
                    {option.label}
                  </span>
                  {option.detail && (
                    <span className="mt-2 block font-ui text-sm leading-relaxed opacity-75">
                      {option.detail}
                    </span>
                  )}
                </span>
                {option.price && (
                  <span className="font-display text-2xl leading-none">
                    {option.price}
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </div>
      {error && (
        <p className="mt-2 font-ui text-sm font-semibold text-orange">{error}</p>
      )}
    </div>
  );
}

function AnswerRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="border-b border-ink/15 py-3 last:border-b-0">
      <div className="font-mono-display text-[10px] uppercase tracking-[0.22em] text-ink/50">
        {label}
      </div>
      <div className="mt-1 break-words font-ui text-sm text-ink">{value || "Not set"}</div>
    </div>
  );
}

const RegistrationPacket = ({
  selectedPackage,
  intentKey,
}: RegistrationPacketProps) => {
  const [form, setForm] = useState<RegistrationFormState>(() => loadDraft());
  const [activeStep, setActiveStep] = useState<StepId>("athlete");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitState, setSubmitState] = useState<
    "idle" | "submitting" | "submitted" | "error"
  >("idle");
  const submittingRef = useRef(false);
  const submitTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (!selectedPackage) return;
    setForm((current) => ({
      ...current,
      packageChoice: selectedPackage === "early" ? "standard" : selectedPackage,
    }));
  }, [selectedPackage, intentKey]);

  useEffect(() => {
    if (typeof window === "undefined" || submitState === "submitted") return;
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(form));
  }, [form, submitState]);

  useEffect(
    () => () => {
      if (submitTimeoutRef.current !== null) {
        window.clearTimeout(submitTimeoutRef.current);
      }
    },
    [],
  );

  const visiblePackageOptions = useMemo(
    () => PACKAGE_OPTIONS.filter((option) => option.id !== "early"),
    [],
  );

  const selectedPackageDetails = useMemo(
    () =>
      PACKAGE_OPTIONS.find((option) => option.id === form.packageChoice) ??
      PACKAGE_OPTIONS.find((option) => option.id === "standard"),
    [form.packageChoice],
  );

  const activeStepIndex = STEPS.findIndex((step) => step.id === activeStep);
  const allErrors = useMemo(() => validateAll(form), [form]);
  const completedSteps = useMemo(
    () =>
      STEPS.reduce<Record<StepId, boolean>>((acc, step) => {
        if (step.id === "review") {
          acc[step.id] = Object.keys(allErrors).length === 0;
        } else {
          acc[step.id] = Object.keys(validateStep(step.id, form)).length === 0;
        }
        return acc;
      }, {} as Record<StepId, boolean>),
    [allErrors, form],
  );

  const updateField = <T extends keyof RegistrationFormState>(
    field: T,
    value: RegistrationFormState[T],
  ) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => {
      const next = { ...current };
      delete next[field];
      return next;
    });
    setSubmitState("idle");
  };

  const goToStep = (step: StepId) => {
    setActiveStep(step);
    setSubmitState((current) => (current === "error" ? "idle" : current));
  };

  const goNext = (event?: MouseEvent<HTMLButtonElement>) => {
    event?.preventDefault();

    const stepErrors = validateStep(activeStep, form);
    if (activeStep !== "review" && Object.keys(stepErrors).length > 0) {
      setErrors((current) => ({ ...current, ...stepErrors }));
      return;
    }

    const nextStep = STEPS[activeStepIndex + 1];
    if (nextStep) goToStep(nextStep.id);
  };

  const goBack = () => {
    const previousStep = STEPS[activeStepIndex - 1];
    if (previousStep) goToStep(previousStep.id);
  };

  const googlePayload = useMemo(
    () => Array.from(buildGooglePayload(form).entries()),
    [form],
  );

  const completeSubmission = () => {
    if (!submittingRef.current) return;

    if (submitTimeoutRef.current !== null) {
      window.clearTimeout(submitTimeoutRef.current);
      submitTimeoutRef.current = null;
    }

    if (typeof window !== "undefined") {
      window.sessionStorage.removeItem(STORAGE_KEY);
    }

    submittingRef.current = false;
    setSubmitState("submitted");
    setActiveStep("review");
  };

  const handleSubmit = (event: FormEvent) => {
    if (activeStep !== "review") {
      event.preventDefault();
      goNext();
      return;
    }

    if (
      submittingRef.current ||
      submitState === "submitting" ||
      submitState === "submitted"
    ) {
      event.preventDefault();
      return;
    }

    const nextErrors = validateAll(form);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      event.preventDefault();
      const firstInvalid = STEPS.find(
        (step) =>
          step.id !== "review" &&
          Object.keys(validateStep(step.id, form)).length > 0,
      );
      setActiveStep(firstInvalid?.id ?? "athlete");
      setSubmitState("error");
      return;
    }

    setSubmitState("submitting");
    submittingRef.current = true;

    submitTimeoutRef.current = window.setTimeout(completeSubmission, 6000);
  };

  if (submitState === "submitted") {
    return (
      <section id="register" className="bg-bone border-b-2 border-ink">
        <div className="container py-16 md:py-24">
          <div className="border-2 border-ink bg-orange p-8 md:p-12 shadow-[8px_8px_0_0_hsl(var(--ink))]">
            <div className="font-mono-display text-xs uppercase tracking-[0.28em] text-ink/70">
              Registration sent
            </div>
            <h2 className="mt-4 font-display text-5xl uppercase leading-[0.9] md:text-7xl">
              Packet received.
            </h2>
            <p className="mt-6 max-w-2xl font-ui text-lg leading-relaxed text-ink/80">
              Your Workhouse Warrior Summer registration has been submitted.
              DSC Hoops will follow up with next steps using the contact details
              in this packet.
            </p>
            <button
              type="button"
              onClick={() => {
                setForm(initialFormState());
                submittingRef.current = false;
                setSubmitState("idle");
                setActiveStep("athlete");
              }}
              className="btn-outline-brutal mt-8"
            >
              Start another athlete
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="register" className="bg-bone border-b-2 border-ink">
      <div className="container py-16 md:py-24">
        <div className="flex items-center gap-3 font-mono-display text-xs uppercase tracking-[0.25em] text-ink/70">
          <span className="text-orange">[05]</span>
          <span className="h-px w-10 bg-ink/30" />
          <span>Registration Packet</span>
        </div>

        <div className="mt-4 grid gap-6 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:items-end">
          <div>
            <h2 className="font-display text-5xl uppercase leading-[0.9] md:text-7xl">
              Lock in your athlete's{" "}
              <span className="text-orange">Workhouse summer.</span>
            </h2>
          </div>
          <p className="max-w-xl font-ui text-lg leading-relaxed text-ink/80 lg:justify-self-end">
            Complete one registration packet per athlete. Move through each
            section, review every answer, and submit when your family is ready.
          </p>
        </div>

        <iframe
          className="hidden"
          name={GOOGLE_IFRAME_NAME}
          title="Google Form submission target"
          onLoad={completeSubmission}
        />

        <form
          action={GOOGLE_FORM_ENDPOINT}
          method="POST"
          target={GOOGLE_IFRAME_NAME}
          onSubmit={handleSubmit}
          className="mt-12 grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)]"
        >
          {googlePayload.map(([name, value]) => (
            <input key={name} type="hidden" name={name} value={value} readOnly />
          ))}

          <aside className="min-w-0 lg:sticky lg:top-28 lg:self-start">
            <div className="border-2 border-ink bg-bone">
              {STEPS.map((step, index) => {
                const Icon = step.icon;
                const { answered, total } = countStepAnswers(step.id, form);
                const active = activeStep === step.id;
                const complete = completedSteps[step.id];

                return (
                  <button
                    key={step.id}
                    type="button"
                    aria-current={active ? "step" : undefined}
                    onClick={() => goToStep(step.id)}
                    className={`flex w-full items-center gap-3 border-b-2 border-ink p-4 text-left last:border-b-0 ${
                      active ? "bg-ink text-bone" : "bg-bone text-ink hover:bg-ink/5"
                    }`}
                  >
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center border-2 ${
                        active
                          ? "border-bone text-orange"
                          : complete
                            ? "border-ink bg-orange text-ink"
                            : "border-ink text-ink"
                      }`}
                    >
                      {complete && !active ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Icon className="h-4 w-4" />
                      )}
                    </span>
                    <span className="min-w-0">
                      <span className="block font-display text-xl uppercase leading-none">
                        {String(index + 1).padStart(2, "0")} / {step.label}
                      </span>
                      <span
                        className={`mt-1 block truncate font-mono-display text-[10px] uppercase tracking-[0.18em] ${
                          active ? "text-bone/70" : "text-ink/55"
                        }`}
                      >
                        {step.id === "review"
                          ? complete
                            ? "Ready"
                            : "Check answers"
                          : `${answered}/${total} answered`}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-5 border-2 border-ink bg-ink p-5 text-bone">
              <div className="font-mono-display text-[10px] uppercase tracking-[0.25em] text-bone/60">
                Selected program
              </div>
              <div className="mt-3 font-display text-3xl uppercase leading-none">
                {form.athleteName || "New athlete"}
              </div>
              <div className="mt-2 font-ui text-sm text-bone/70">
                {selectedPackageDetails?.label} - {selectedPackageDetails?.price}
              </div>
            </div>
          </aside>

          <div className="min-w-0 border-2 border-ink bg-bone">
            <div className="border-b-2 border-ink bg-ink p-5 text-bone md:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="font-mono-display text-[10px] uppercase tracking-[0.25em] text-orange">
                    Step {activeStepIndex + 1} of {STEPS.length}
                  </div>
                  <h3 className="mt-2 font-display text-4xl uppercase leading-none md:text-5xl">
                    {STEPS[activeStepIndex].label}
                  </h3>
                </div>
                <div className="border-2 border-bone px-3 py-2 font-mono-display text-[10px] uppercase tracking-[0.2em] text-bone/75">
                  {STEPS[activeStepIndex].shortLabel}
                </div>
              </div>
            </div>

            <div className="p-5 md:p-8">
              {activeStep === "athlete" && (
                <div className="grid gap-5 md:grid-cols-2">
                  <TextField
                    label="Email Address"
                    type="email"
                    value={form.email}
                    error={errors.email}
                    placeholder="name@example.com"
                    onChange={(value) => updateField("email", value)}
                  />
                  <TextField
                    label="Athlete's Name"
                    value={form.athleteName}
                    error={errors.athleteName}
                    placeholder="First and last name"
                    onChange={(value) => updateField("athleteName", value)}
                  />
                  <TextField
                    label="Athlete's Phone #"
                    value={form.athletePhone}
                    error={errors.athletePhone}
                    placeholder="555-555-5555"
                    inputMode="tel"
                    onChange={(value) => updateField("athletePhone", value)}
                  />
                  <TextField
                    label="Athlete's DOB"
                    type="date"
                    value={form.athleteDob}
                    error={errors.athleteDob}
                    onChange={(value) => updateField("athleteDob", value)}
                  />
                  <SelectField
                    label="Athlete's Grade"
                    value={form.athleteGrade}
                    error={errors.athleteGrade}
                    placeholder="Select grade"
                    options={GRADES}
                    onChange={(value) => updateField("athleteGrade", value)}
                  />
                  <TextField
                    label="Athlete's Age"
                    type="number"
                    value={form.athleteAge}
                    error={errors.athleteAge}
                    placeholder="15"
                    inputMode="numeric"
                    onChange={(value) => updateField("athleteAge", value)}
                  />
                  <TextField
                    label="Weight and Height"
                    value={form.athleteMeasurements}
                    error={errors.athleteMeasurements}
                    placeholder="150 lbs / 5 ft 8 in"
                    onChange={(value) => updateField("athleteMeasurements", value)}
                  />
                  <SelectField
                    label="Athlete's Shirt Size"
                    value={form.shirtSize}
                    error={errors.shirtSize}
                    placeholder="Select size"
                    options={SHIRT_SIZES}
                    onChange={(value) => updateField("shirtSize", value)}
                  />
                </div>
              )}

              {activeStep === "parent" && (
                <div className="grid gap-5 md:grid-cols-2">
                  <TextField
                    label="Parent / Guardian Name"
                    value={form.parentName}
                    error={errors.parentName}
                    placeholder="First and last name"
                    onChange={(value) => updateField("parentName", value)}
                  />
                  <TextField
                    label="Parent / Guardian Email"
                    type="email"
                    value={form.parentEmail}
                    error={errors.parentEmail}
                    placeholder="name@example.com"
                    onChange={(value) => updateField("parentEmail", value)}
                  />
                  <div className="md:col-span-2">
                    <TextField
                      label="Parent Address"
                      value={form.parentAddress}
                      error={errors.parentAddress}
                      placeholder="Street, city, state, zip"
                      onChange={(value) => updateField("parentAddress", value)}
                    />
                  </div>
                  <TextField
                    label="Parent / Guardian Phone"
                    value={form.parentPhone}
                    error={errors.parentPhone}
                    placeholder="555-555-5555"
                    inputMode="tel"
                    onChange={(value) => updateField("parentPhone", value)}
                  />
                  <TextField
                    label="Emergency Contact Name"
                    value={form.emergencyName}
                    error={errors.emergencyName}
                    placeholder="First and last name"
                    onChange={(value) => updateField("emergencyName", value)}
                  />
                  <TextField
                    label="Emergency Contact Phone"
                    value={form.emergencyPhone}
                    error={errors.emergencyPhone}
                    placeholder="555-555-5555"
                    inputMode="tel"
                    onChange={(value) => updateField("emergencyPhone", value)}
                  />
                </div>
              )}

              {activeStep === "program" && (
                <div className="grid gap-7">
                  <div className="grid gap-5 md:grid-cols-2">
                    <SelectField
                      label="Athlete's Skill Level"
                      value={form.skillLevel}
                      error={errors.skillLevel}
                      placeholder="Select level"
                      options={SKILL_LEVELS}
                      onChange={(value) => updateField("skillLevel", value)}
                    />
                    <SelectField
                      label="How did you hear about us?"
                      value={form.heardFrom}
                      error={errors.heardFrom}
                      placeholder="Select one"
                      options={HEARD_FROM}
                      onChange={(value) => updateField("heardFrom", value)}
                    />
                  </div>

                  <div>
                    <div className="mb-3 font-mono-display text-[11px] uppercase tracking-[0.22em] text-ink/70">
                      Executive Health Club Membership
                    </div>
                    <ChoiceGrid
                      value={form.membershipStatus}
                      error={errors.membershipStatus}
                      onChange={(value) => updateField("membershipStatus", value)}
                      options={MEMBERSHIP_OPTIONS}
                    />
                  </div>

                  <div>
                    <div className="mb-3 font-mono-display text-[11px] uppercase tracking-[0.22em] text-ink/70">
                      Summer Package
                    </div>
                    <div className="mb-4 border-2 border-ink bg-orange p-4 shadow-[5px_5px_0_0_hsl(var(--ink))]">
                      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                          <div className="font-mono-display text-[10px] uppercase tracking-[0.25em] text-ink/65">
                            Rate update
                          </div>
                          <div className="mt-1 font-display text-3xl uppercase leading-none text-ink">
                            Standard rate in effect
                          </div>
                          <p className="mt-2 font-ui text-sm text-ink/75">
                            Choose the $4,000 full program or weekly
                            registration below.
                          </p>
                        </div>
                        <div className="border-2 border-ink bg-bone px-4 py-3 text-center">
                          <div className="font-display text-4xl leading-none text-ink">
                            $4,000
                          </div>
                          <div className="mt-1 font-mono-display text-[9px] uppercase tracking-[0.18em] text-ink/55">
                            Full Program
                          </div>
                        </div>
                      </div>
                    </div>
                    <ChoiceGrid
                      value={form.packageChoice}
                      onChange={(value) =>
                        updateField("packageChoice", value as ProgramPackageId)
                      }
                      options={visiblePackageOptions.map((option) => ({
                        value: option.id,
                        label: option.label,
                        detail: `${option.kicker} - ${option.detail}`,
                        price: option.price,
                      }))}
                    />
                  </div>

                  <div className="border-2 border-ink bg-ink p-5 text-bone">
                    <div className="font-mono-display text-[10px] uppercase tracking-[0.25em] text-orange">
                      Facility location
                    </div>
                    <div className="mt-2 font-display text-3xl uppercase leading-none">
                      Executive Health and Sports Club
                    </div>
                    <p className="mt-2 font-ui text-sm text-bone/70">
                      1 Highlander Way, Manchester, NH. Membership requirements
                      are handled by the club membership office.
                    </p>
                  </div>
                </div>
              )}

              {activeStep === "waiver" && (
                <div className="grid gap-6">
                  <div className="max-h-72 overflow-y-auto border-2 border-ink bg-white/50 p-5">
                    <div className="font-mono-display text-[10px] uppercase tracking-[0.25em] text-orange">
                      Liability and sportsmanship waiver
                    </div>
                    <div className="mt-4 space-y-4 font-ui text-sm leading-relaxed text-ink/80">
                      {WAIVER_TEXT.map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                      ))}
                    </div>
                  </div>

                  <button
                    type="button"
                    aria-pressed={form.waiverAccepted}
                    onClick={() =>
                      updateField("waiverAccepted", !form.waiverAccepted)
                    }
                    className={`flex items-center gap-4 border-2 p-4 text-left ${
                      form.waiverAccepted
                        ? "border-ink bg-orange text-ink"
                        : "border-ink bg-bone text-ink"
                    }`}
                  >
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center border-2 border-ink ${
                        form.waiverAccepted ? "bg-ink text-bone" : "bg-bone"
                      }`}
                    >
                      {form.waiverAccepted && <Check className="h-4 w-4" />}
                    </span>
                    <span className="font-ui font-semibold">
                      I have read and agree to the terms.
                    </span>
                  </button>
                  {errors.waiverAccepted && (
                    <p className="font-ui text-sm font-semibold text-orange">
                      {errors.waiverAccepted}
                    </p>
                  )}

                  <TextField
                    label="Family 10% Sibling Discount"
                    value={form.siblingDiscountName}
                    placeholder="Optional referring sibling name"
                    onChange={(value) => updateField("siblingDiscountName", value)}
                  />

                  <div className="grid gap-5 md:grid-cols-2">
                    <TextField
                      label="Digital Signature"
                      value={form.digitalSignature}
                      error={errors.digitalSignature}
                      placeholder="Parent / guardian first and last name"
                      onChange={(value) => updateField("digitalSignature", value)}
                    />
                    <TextField
                      label="Date Signed"
                      type="date"
                      value={form.dateSigned}
                      error={errors.dateSigned}
                      onChange={(value) => updateField("dateSigned", value)}
                    />
                  </div>
                </div>
              )}

              {activeStep === "review" && (
                <div className="grid gap-6">
                  {Object.keys(allErrors).length > 0 ? (
                    <div className="border-2 border-orange bg-orange/10 p-5">
                      <div className="font-display text-3xl uppercase leading-none">
                        A few fields need attention.
                      </div>
                      <p className="mt-2 font-ui text-sm text-ink/75">
                        Jump to any section on the left, or use the edit buttons
                        below, then come back here to submit.
                      </p>
                    </div>
                  ) : (
                    <div className="border-2 border-ink bg-orange p-5">
                      <div className="font-display text-3xl uppercase leading-none">
                        Ready to submit.
                      </div>
                      <p className="mt-2 font-ui text-sm text-ink/75">
                        Review the packet below. When it looks right, send it to
                        DSC Hoops registration.
                      </p>
                    </div>
                  )}

                  <ReviewGroup title="Athlete" onEdit={() => goToStep("athlete")}>
                    <AnswerRow label="Email" value={form.email} />
                    <AnswerRow label="Athlete" value={form.athleteName} />
                    <AnswerRow label="Phone" value={form.athletePhone} />
                    <AnswerRow label="DOB" value={form.athleteDob} />
                    <AnswerRow
                      label="Grade / Age"
                      value={`${form.athleteGrade || "Not set"} / ${
                        form.athleteAge || "Not set"
                      }`}
                    />
                    <AnswerRow label="Weight + Height" value={form.athleteMeasurements} />
                    <AnswerRow label="Shirt" value={form.shirtSize} />
                  </ReviewGroup>

                  <ReviewGroup title="Contacts" onEdit={() => goToStep("parent")}>
                    <AnswerRow label="Parent" value={form.parentName} />
                    <AnswerRow label="Address" value={form.parentAddress} />
                    <AnswerRow label="Parent email" value={form.parentEmail} />
                    <AnswerRow label="Parent phone" value={form.parentPhone} />
                    <AnswerRow label="Emergency contact" value={form.emergencyName} />
                    <AnswerRow label="Emergency phone" value={form.emergencyPhone} />
                  </ReviewGroup>

                  <ReviewGroup title="Program" onEdit={() => goToStep("program")}>
                    <AnswerRow label="Skill level" value={form.skillLevel} />
                    <AnswerRow label="Heard from" value={form.heardFrom} />
                    <AnswerRow
                      label="Membership"
                      value={
                        MEMBERSHIP_OPTIONS.find(
                          (option) => option.value === form.membershipStatus,
                        )?.label ?? form.membershipStatus
                      }
                    />
                    <AnswerRow label="Facility" value={form.facilityLocation} />
                    <AnswerRow
                      label="Package"
                      value={`${selectedPackageDetails?.label ?? "Not set"} - ${
                        selectedPackageDetails?.price ?? ""
                      }`}
                    />
                  </ReviewGroup>

                  <ReviewGroup title="Agreement" onEdit={() => goToStep("waiver")}>
                    <AnswerRow
                      label="Waiver"
                      value={form.waiverAccepted ? "Agreed" : "Not agreed"}
                    />
                    <AnswerRow
                      label="Sibling discount"
                      value={form.siblingDiscountName || "None"}
                    />
                    <AnswerRow label="Signature" value={form.digitalSignature} />
                    <AnswerRow label="Date signed" value={form.dateSigned} />
                  </ReviewGroup>
                </div>
              )}
            </div>

            <div className="flex flex-col-reverse gap-3 border-t-2 border-ink p-5 md:flex-row md:items-center md:justify-between md:p-6">
              <button
                type="button"
                onClick={goBack}
                disabled={activeStepIndex === 0 || submitState === "submitting"}
                className="inline-flex items-center justify-center gap-2 border-2 border-ink px-5 py-3 font-display text-lg uppercase transition-colors hover:bg-ink hover:text-bone disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>

              {activeStep === "review" ? (
                <button
                  key="submit-registration"
                  type="submit"
                  disabled={submitState === "submitting"}
                  className="btn-brutal justify-center disabled:cursor-wait disabled:opacity-70"
                >
                  {submitState === "submitting" ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Sending
                    </>
                  ) : (
                    <>
                      Submit Registration
                      <Send className="h-5 w-5" />
                    </>
                  )}
                </button>
              ) : (
                <button
                  key="continue-registration"
                  type="button"
                  onClick={goNext}
                  className="btn-brutal justify-center"
                >
                  Continue
                  <ArrowRight className="h-5 w-5" />
                </button>
              )}
            </div>

            {submitState === "error" && (
              <div className="border-t-2 border-ink bg-orange/15 p-4 font-ui text-sm font-semibold text-ink">
                Check the highlighted fields, then submit again.
              </div>
            )}
          </div>
        </form>
      </div>
    </section>
  );
};

function ReviewGroup({
  title,
  onEdit,
  children,
}: {
  title: string;
  onEdit: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="border-2 border-ink">
      <div className="flex items-center justify-between gap-4 border-b-2 border-ink bg-ink px-4 py-3 text-bone">
        <h4 className="font-display text-2xl uppercase leading-none">{title}</h4>
        <button
          type="button"
          onClick={onEdit}
          className="inline-flex items-center gap-2 font-mono-display text-[10px] uppercase tracking-[0.2em] text-bone/75 hover:text-orange"
        >
          <Edit3 className="h-3.5 w-3.5" />
          Edit
        </button>
      </div>
      <div className="grid gap-x-6 px-4 md:grid-cols-2">{children}</div>
    </div>
  );
}

export default RegistrationPacket;
