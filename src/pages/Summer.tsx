import { type MouseEvent, useState } from "react";
import courtEmpty from "@/assets/court-empty.jpg";
import handsBall from "@/assets/hands-ball.jpg";
import heroPlayer from "@/assets/hero-player.jpg";
import summerHero from "@/assets/summer-hero.jpg";
import workhouseLogo from "@/assets/workhouse-logo.png";
import RegistrationPacket, {
  type ProgramPackageId,
} from "@/components/RegistrationPacket";

const CONTACT_EMAIL = "hoops@dscinternationalgroup.com";

const signupSteps = [
  {
    n: "01",
    title: "Pick your summer track",
    body: "Full 9 weeks or week-by-week — whichever fits your family's plans. You can switch before you submit.",
  },
  {
    n: "02",
    title: "Have your athlete's info handy",
    body: "Basics like grade, age, weight and height, and shirt size, plus a parent contact and one emergency contact. About ten minutes per athlete.",
  },
  {
    n: "03",
    title: "Submit and we'll be in touch",
    body: "After you submit, we'll follow up to confirm your athlete's spot and walk you through the Executive Health Club membership if required.",
  },
];

const programPillars = [
  {
    label: "01 / Training",
    title: "Elite Reps",
    body: "Twenty-seven summer sessions built around skill work, conditioning, decision-making, and daily accountability.",
  },
  {
    label: "02 / Exposure",
    title: "Pro Guests",
    body: "Professional players, elite trainers, and guest appearances bring outside energy into the gym throughout the summer.",
    dark: true,
  },
  {
    label: "03 / Intent",
    title: "Season Ready",
    body: "The goal is simple: show up in June, stack the work, and enter the next season with a different level of confidence.",
  },
];

const scheduleDays = [
  {
    day: "Tuesday",
    title: "Skill Build / Game IQ / Compete",
    time: "5:00 AM - 9:00 AM",
    body: "Every training morning follows the same routine: skill build, game IQ, and compete before athletes leave the gym.",
  },
  {
    day: "Wednesday",
    title: "Skill Build / Game IQ / Compete",
    time: "5:00 AM - 9:00 AM",
    body: "Every training morning follows the same routine: skill build, game IQ, and compete before athletes leave the gym.",
  },
  {
    day: "Thursday",
    title: "Skill Build / Game IQ / Compete",
    time: "5:00 AM - 9:00 AM",
    body: "Every training morning follows the same routine: skill build, game IQ, and compete before athletes leave the gym.",
  },
];

const detailStats = [
  { label: "Dates", value: "June 16 - Aug 13", sub: "9 weeks" },
  { label: "Days", value: "Tue / Wed / Thu", sub: "3 mornings per week" },
  { label: "Time", value: "5:00 - 9:00 AM", sub: "4 hours per session" },
  { label: "Location", value: "Executive Health Club", sub: "Manchester, NH" },
];

const finePrint = [
  {
    label: "Membership",
    title: "EHC membership required",
    body: "Participants must have a current Executive Health Club membership before sessions begin. Athlete membership can be individual or family. New summer memberships cost $255 and are paid directly to Executive Health Club.",
  },
  {
    label: "Calendar",
    title: "Guest details coming",
    body: "The weekly guest and programming calendar will be shared as June approaches. Registering now locks your athlete's spot.",
  },
];

const Marquee = ({ text }: { text: string }) => (
  <div className="relative overflow-hidden border-y-2 border-ink bg-ink text-bone">
    <div className="flex whitespace-nowrap animate-marquee py-3">
      {Array.from({ length: 8 }).map((_, index) => (
        <span
          key={index}
          className="flex shrink-0 items-center gap-6 px-6 font-display text-xl uppercase md:text-2xl"
        >
          {text}
          <span className="text-orange">•</span>
        </span>
      ))}
    </div>
  </div>
);

const SectionLabel = ({
  index,
  label,
  dark = false,
}: {
  index: string;
  label: string;
  dark?: boolean;
}) => (
  <div
    className={`flex items-center gap-3 font-mono-display text-xs uppercase tracking-[0.25em] ${
      dark ? "text-bone/70" : "text-ink/70"
    }`}
  >
    <span className="text-orange">[{index}]</span>
    <span className={`h-px w-10 ${dark ? "bg-bone/30" : "bg-ink/30"}`} />
    <span>{label}</span>
  </div>
);

const Summer = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [registrationIntent, setRegistrationIntent] = useState<{
    packageId?: ProgramPackageId;
    key: number;
  }>({ key: 0 });

  const jumpToRegistration =
    (packageId?: ProgramPackageId) => (event: MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault();
      setMenuOpen(false);
      setRegistrationIntent((current) => ({
        packageId,
        key: current.key + 1,
      }));

      window.history.replaceState(null, "", "#register");
      document.getElementById("register")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    };

  const primaryPackage: ProgramPackageId = "standard";

  return (
    <div className="min-h-screen overflow-x-hidden bg-bone text-ink selection:bg-orange">
      <div className="bg-orange text-ink border-b-2 border-ink">
        <div className="container flex items-center justify-between gap-4 py-2 font-mono-display text-xs uppercase tracking-wider md:text-sm">
          <div className="flex min-w-0 items-center gap-2 md:gap-3">
            <span className="hidden font-display text-lg leading-none sm:inline">
              •
            </span>
            <span className="truncate">
              Summer 2026 · Doors open · 9 weeks of Warrior training · $4,000
            </span>
          </div>
          <a
            href="#register"
            onClick={jumpToRegistration(primaryPackage)}
            className="hidden shrink-0 border-l-2 border-ink pl-3 hover:opacity-70 sm:inline"
          >
            Start registration
          </a>
        </div>
      </div>

      <header className="sticky top-0 z-50 border-b-2 border-ink bg-bone/95 backdrop-blur">
        <div className="container flex items-center justify-between py-4">
          <a href="#top" className="flex items-center gap-3">
            <img
              src={workhouseLogo}
              alt=""
              className="h-10 w-10 object-contain"
            />
            <div className="leading-tight">
              <div className="font-display text-xl uppercase">Workhouse</div>
              <div className="font-mono-display text-[10px] uppercase tracking-[0.25em] text-ink/60">
                Warrior Summer 2026
              </div>
            </div>
          </a>

          <nav className="hidden items-center gap-8 font-mono-display text-sm uppercase tracking-wider md:flex">
            <a href="#program" className="transition-colors hover:text-orange">
              Program
            </a>
            <a href="#schedule" className="transition-colors hover:text-orange">
              Schedule
            </a>
            <a href="#pricing" className="transition-colors hover:text-orange">
              Pricing
            </a>
            <a href="#register" className="transition-colors hover:text-orange">
              Register
            </a>
          </nav>

          <a
            href="#register"
            onClick={jumpToRegistration(primaryPackage)}
            className="hidden md:inline-flex btn-outline-brutal"
          >
            Register →
          </a>

          <button
            onClick={() => setMenuOpen((value) => !value)}
            className="flex h-10 w-10 items-center justify-center border-2 border-ink md:hidden"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            aria-controls="summer-mobile-menu"
          >
            <div className="space-y-1.5">
              <span className="block h-0.5 w-5 bg-ink" />
              <span className="block h-0.5 w-5 bg-ink" />
              <span className="block h-0.5 w-5 bg-ink" />
            </div>
          </button>
        </div>

        {menuOpen && (
          <div id="summer-mobile-menu" className="border-t-2 border-ink bg-bone md:hidden">
            <div className="container flex flex-col gap-3 py-4 font-mono-display text-sm uppercase">
              <a href="#program" onClick={() => setMenuOpen(false)}>
                Program
              </a>
              <a href="#schedule" onClick={() => setMenuOpen(false)}>
                Schedule
              </a>
              <a href="#pricing" onClick={() => setMenuOpen(false)}>
                Pricing
              </a>
              <a
                href="#register"
                onClick={jumpToRegistration(primaryPackage)}
                className="btn-brutal mt-2 w-full"
              >
                Register Now →
              </a>
            </div>
          </div>
        )}
      </header>

      <section id="top" className="relative overflow-hidden border-b-2 border-ink bg-bone">
        <div className="absolute inset-0 grid-paper opacity-60 pointer-events-none" />
        <div className="container relative py-12 md:py-16 xl:py-20">
          <div className="grid grid-cols-12 items-stretch gap-6">
            <div className="col-span-12 flex flex-col justify-between lg:col-span-7">
              <div>
                <div className="flex items-center gap-3 font-mono-display text-xs uppercase tracking-[0.3em] text-ink/70">
                  <span className="h-2 w-2 bg-orange" />
                  Registration is now open
                </div>

                <h1 className="mt-6 font-display text-[clamp(4.2rem,11vw,10.75rem)] uppercase leading-[0.82]">
                  <span className="block">Workhouse</span>
                  <span className="block text-orange">Warrior</span>
                  <span className="block relative">
                    <span className="relative z-10">Summer</span>
                    <span className="absolute inset-x-0 top-1/2 h-[0.18em] bg-ink/15 -z-0" />
                  </span>
                  <span className="block">
                    <span className="inline-block bg-ink px-4 text-bone -skew-x-6">
                      2026.
                    </span>
                  </span>
                </h1>

                <p className="mt-8 max-w-2xl font-ui text-lg leading-relaxed text-ink/80 md:text-xl">
                  Nine weeks, twenty-seven sessions, pro guests, and 5 AM work
                  built for athletes who want to walk into next season with a
                  different game.
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <a
                    href="#register"
                    onClick={jumpToRegistration(primaryPackage)}
                    className="btn-brutal"
                  >
                    Start Registration
                    <span aria-hidden>→</span>
                  </a>
                  <a href="#schedule" className="btn-outline-brutal">
                    View Schedule
                  </a>
                </div>
              </div>

              <div className="mt-12 grid grid-cols-3 divide-x-2 divide-ink border-2 border-ink">
                {[
                  { n: "9", l: "Weeks" },
                  { n: "27", l: "Sessions" },
                  { n: "5AM", l: "Lights On" },
                ].map((stat, index) => (
                  <div
                    key={stat.l}
                    className={`p-4 md:p-5 ${index === 2 ? "bg-ink text-bone" : ""}`}
                  >
                    <div className="font-display text-4xl leading-none md:text-5xl">
                      {stat.n}
                    </div>
                    <div
                      className={`mt-2 font-mono-display text-[10px] uppercase tracking-[0.2em] ${
                        index === 2 ? "text-bone/70" : "text-ink/60"
                      }`}
                    >
                      {stat.l}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="col-span-12 lg:col-span-5 relative">
              <div className="noise relative h-[480px] overflow-hidden border-2 border-ink md:h-[620px] xl:h-[680px]">
                <img
                  src={heroPlayer}
                  alt="Young basketball player training in the gym"
                  className="absolute inset-0 h-full w-full object-cover grayscale contrast-125"
                  width={1080}
                  height={1920}
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-ink/60 via-transparent to-transparent" />
                <div className="tag-chip absolute left-4 top-4 bg-bone">
                  <span className="h-1.5 w-1.5 bg-orange" /> SUMMER / ON COURT
                </div>
                <div className="tag-chip absolute bottom-4 right-4 bg-orange">
                  June 16 - Aug 13
                </div>
                <div className="card-brutal absolute bottom-4 left-4 flex items-center gap-3 p-3 pr-4">
                  <div className="font-display text-4xl leading-none text-orange">
                    27
                  </div>
                  <div>
                    <div className="font-mono-display text-[10px] uppercase tracking-widest text-ink/60">
                      Sessions
                    </div>
                    <div className="font-display uppercase leading-tight">
                      Tue / Wed / Thu
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Marquee text="9 Weeks · 27 Sessions · Pro Guests · 5 AM Lights On · Workhouse Warrior Summer" />

      <section className="border-b-2 border-ink bg-bone">
        <div className="container py-10 md:py-14">
          <div className="grid items-center gap-8 md:grid-cols-12">
            <div className="md:col-span-7">
              <SectionLabel index="00" label="Now Booking" />
              <h2 className="mt-4 font-display text-4xl uppercase leading-[0.95] md:text-5xl">
                Doors still open.
                <br />
                <span className="text-orange">Full program, full send.</span>
              </h2>
              <p className="mt-4 max-w-2xl font-ui text-ink/80">
                The work isn't. Lock in nine weeks of 5 AM Warrior training at
                $4,000 — or grab weekly registration if the full summer isn't on
                the table.
              </p>
            </div>
            <div className="md:col-span-5">
              <div className="border-2 border-ink bg-ink p-5 text-bone md:p-6">
                <div className="font-mono-display text-[10px] uppercase tracking-[0.25em] text-orange">
                  Current full-program rate
                </div>
                <div className="mt-2 font-display text-6xl leading-none">$4,000</div>
                <p className="mt-3 font-ui text-sm text-bone/70">
                  Workhouse Warrior Summer, June 16 - Aug 13.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="signup" className="border-b-2 border-ink bg-bone">
        <div className="container py-16 md:py-24">
          <div className="mb-12 grid grid-cols-12 items-end gap-6">
            <div className="col-span-12 md:col-span-8">
              <SectionLabel index="01" label="How to Sign Up" />
              <h2 className="mt-4 font-display text-5xl uppercase leading-[0.9] md:text-7xl">
                Three moves.
                <br />
                <span className="text-orange">Spot reserved.</span>
              </h2>
            </div>
            <div className="col-span-12 md:col-span-4 md:text-right">
              <p className="font-ui text-ink/70">
                Here's what to expect when you register your athlete, and what
                we'll need from you to lock the spot in.
              </p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {signupSteps.map((step, index) => (
              <div
                key={step.n}
                className="card-brutal relative flex flex-col p-6 md:p-8"
                style={{ transform: `translateY(${index * 8}px)` }}
              >
                <div className="flex items-start justify-between">
                  <div className="font-display text-6xl leading-none text-orange md:text-7xl">
                    {step.n}
                  </div>
                  <div className="flex h-8 w-8 items-center justify-center border-2 border-ink">
                    <span className="h-2 w-2 bg-ink" />
                  </div>
                </div>
                <h3 className="mt-6 font-display text-3xl uppercase leading-tight">
                  {step.title}
                </h3>
                <p className="mt-3 flex-1 font-ui text-ink/75">{step.body}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 flex flex-wrap items-center gap-4">
            <a
              href="#register"
              onClick={jumpToRegistration(primaryPackage)}
              className="btn-brutal"
            >
              Start Registration →
            </a>
            <a href="#pricing" className="btn-outline-brutal">
              Compare Packages
            </a>
          </div>
        </div>
      </section>

      <section id="program" className="relative overflow-hidden border-b-2 border-ink bg-ink text-bone">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25"
          style={{ backgroundImage: `url(${courtEmpty})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/90 to-ink" />
        <div className="container relative py-16 md:py-24">
          <div className="mb-12 grid grid-cols-12 items-end gap-6">
            <div className="col-span-12 md:col-span-8">
              <SectionLabel index="02" label="The Program" dark />
              <h2 className="mt-4 max-w-4xl font-display text-5xl uppercase leading-[0.9] md:text-7xl">
                Get a whole season better{" "}
                <span className="text-orange">in a summer.</span>
              </h2>
            </div>
            <div className="col-span-12 md:col-span-4 md:text-right">
              <p className="font-ui text-bone/75">
                Serious morning work, clear expectations, and a program designed
                to make the next season feel different.
              </p>
            </div>
          </div>

          <div className="grid border-2 border-bone/20 md:grid-cols-3">
            {programPillars.map((pillar, index) => (
              <div
                key={pillar.label}
                className={`p-8 md:p-10 ${
                  index !== programPillars.length - 1
                    ? "border-b-2 border-bone/20 md:border-b-0 md:border-r-2"
                    : ""
                } ${pillar.dark ? "bg-bone text-ink" : ""}`}
              >
                <div className="font-mono-display text-xs uppercase tracking-[0.25em] text-orange">
                  {pillar.label}
                </div>
                <h3 className="mt-4 font-display text-4xl uppercase leading-none">
                  {pillar.title}
                </h3>
                <p
                  className={`mt-4 font-ui leading-relaxed ${
                    pillar.dark ? "text-ink/80" : "text-bone/75"
                  }`}
                >
                  {pillar.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="schedule" className="border-b-2 border-ink bg-bone">
        <div className="container py-16 md:py-24">
          <div className="mb-12 grid grid-cols-12 items-end gap-6">
            <div className="col-span-12 md:col-span-8">
              <SectionLabel index="03" label="Summer Schedule" />
              <h2 className="mt-4 font-display text-5xl uppercase leading-[0.9] md:text-7xl">
                Summer schedule.
                <br />
                <span className="text-orange">Clear and locked.</span>
              </h2>
            </div>
            <div className="col-span-12 md:col-span-4 md:text-right">
              <p className="font-ui text-ink/70">
                Three focused training mornings every week at Executive Health
                Club. Register your athlete right here on this page.
              </p>
            </div>
          </div>

          <div className="grid border-2 border-ink md:grid-cols-4">
            {detailStats.map((item, index) => (
              <div
                key={item.label}
                className={`p-6 md:p-7 ${
                  index < detailStats.length - 1
                    ? "border-b-2 border-ink md:border-b-0 md:border-r-2"
                    : ""
                }`}
              >
                <div className="font-mono-display text-xs uppercase tracking-[0.25em] text-orange">
                  {item.label}
                </div>
                <div className="mt-3 font-display text-3xl uppercase leading-tight">
                  {item.value}
                </div>
                <div className="mt-2 font-mono-display text-xs uppercase tracking-wider text-ink/60">
                  {item.sub}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 grid gap-0 border-2 border-ink md:grid-cols-3">
            {scheduleDays.map((day, index) => (
              <div
                key={day.day}
                className={`p-8 ${
                  index !== scheduleDays.length - 1
                    ? "border-b-2 border-ink md:border-b-0 md:border-r-2"
                    : ""
                }`}
              >
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="font-display text-4xl uppercase leading-none">
                    {day.day}
                  </h3>
                  <span className="font-mono-display text-[10px] uppercase tracking-widest text-ink/50">
                    {String(index + 1).padStart(2, "0")} / 03
                  </span>
                </div>
                <div className="mt-3 font-mono-display text-xs uppercase tracking-[0.25em] text-orange">
                  {day.time}
                </div>
                <h4 className="mt-6 font-display text-3xl uppercase leading-none">
                  {day.title}
                </h4>
                <p className="mt-3 font-ui leading-relaxed text-ink/75">
                  {day.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="border-b-2 border-ink bg-bone">
        <div className="container py-16 md:py-24">
          <div className="mb-12 grid grid-cols-12 items-end gap-6">
            <div className="col-span-12 md:col-span-8">
              <SectionLabel index="04" label="Pricing" />
              <h2 className="mt-4 font-display text-5xl uppercase leading-[0.9] md:text-7xl">
                Full commit.
                <br />
                <span className="text-orange">Or weekly.</span>
              </h2>
            </div>
            <div className="col-span-12 md:col-span-4 md:text-right">
              <p className="font-ui text-ink/70">
                The full nine weeks bundle every session into one tuition—your
                athlete gets the full Warrior arc, not piecemeal weeks. Weekly
                registration stays flexible.
              </p>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="card-brutal relative overflow-hidden">
              <div
                className="absolute inset-0 bg-cover bg-center opacity-20"
                style={{ backgroundImage: `url(${handsBall})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-br from-bone via-bone/95 to-orange/20" />
              <div className="relative p-8 md:p-10">
                <div className="inline-flex border-2 border-ink bg-orange px-3 py-1 font-mono-display text-xs uppercase tracking-[0.25em]">
                  Full Program
                </div>
                <h3 className="mt-6 font-display text-5xl uppercase leading-[0.9] md:text-6xl">
                  Complete
                  <br />
                  Summer Track
                </h3>
                <div className="mt-6 flex items-baseline gap-3">
                  <div className="font-display text-6xl text-orange md:text-7xl">
                    $4,000
                  </div>
                  <div className="font-mono-display text-xs uppercase tracking-widest text-ink/60">
                    9 weeks
                  </div>
                </div>
                <div className="mt-1 font-mono-display text-sm text-ink/50">
                  One tuition · all 27 sessions
                </div>
                <ul className="mt-8 space-y-3 font-ui">
                  {[
                    "Full 9-week Workhouse Warrior program",
                    "Tue / Wed / Thu, 5 AM - 9 AM",
                    "Register one athlete at a time, review before you submit",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-orange" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href="#register"
                  onClick={jumpToRegistration("standard")}
                  className="btn-brutal mt-8"
                >
                  Register full program →
                </a>
              </div>
            </div>

            <div className="grid gap-6">
              <div className="border-2 border-ink bg-ink p-8 text-bone md:p-10">
                <div className="font-mono-display text-xs uppercase tracking-[0.25em] text-orange">
                  Full Program Includes
                </div>
                <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <h3 className="font-display text-4xl uppercase leading-none">
                      The complete summer
                    </h3>
                    <p className="mt-3 max-w-md font-ui text-bone/70">
                      All 27 training sessions, weekly development blocks, guest
                      programming as scheduled, and the full Warrior summer
                      structure.
                    </p>
                  </div>
                  <div className="font-display text-6xl text-bone">27</div>
                </div>
                <div className="mt-8 border-t border-bone/20 pt-5 font-mono-display text-xs uppercase tracking-[0.22em] text-bone/60">
                  Tue / Wed / Thu · 5 AM - 9 AM
                </div>
              </div>

              <div className="border-2 border-ink p-8 md:p-10">
                <div className="font-mono-display text-xs uppercase tracking-[0.25em] text-orange">
                  Weekly Registration
                </div>
                <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <h3 className="font-display text-4xl uppercase leading-none">
                      Individual weeks
                    </h3>
                    <p className="mt-3 max-w-md font-ui text-ink/70">
                      Flexible weekly registration for families who need
                      individual weeks.
                    </p>
                  </div>
                  <div>
                    <span className="font-display text-6xl">$550</span>
                    <span className="ml-2 font-mono-display text-xs uppercase tracking-wider text-ink/60">
                      / week
                    </span>
                  </div>
                </div>
                <a
                  href="#register"
                  onClick={jumpToRegistration("weekly")}
                  className="mt-8 inline-flex items-center justify-center border-2 border-ink px-6 py-3 font-mono-display text-sm uppercase tracking-wider transition-colors hover:bg-ink hover:text-bone"
                >
                  Register Weekly →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b-2 border-ink bg-bone">
        <div className="container py-16 md:py-24">
          <SectionLabel index="05" label="Before You Sign Up" />
          <h2 className="mt-4 font-display text-4xl uppercase leading-[0.9] md:text-6xl">
            Read the <span className="text-orange">fine print.</span>
          </h2>

          <div className="mt-12 grid border-2 border-ink md:grid-cols-2">
            {finePrint.map((item, index) => (
              <div
                key={item.label}
                className={`p-8 ${
                  index !== finePrint.length - 1
                    ? "border-b-2 border-ink md:border-b-0 md:border-r-2"
                    : ""
                }`}
              >
                <div className="font-mono-display text-xs uppercase tracking-[0.25em] text-orange">
                  {item.label}
                </div>
                <h3 className="mt-3 font-display text-2xl uppercase leading-tight">
                  {item.title}
                </h3>
                <p className="mt-4 font-ui leading-relaxed text-ink/80">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <RegistrationPacket
        selectedPackage={registrationIntent.packageId}
        intentKey={registrationIntent.key}
      />

      <section className="relative overflow-hidden bg-ink text-bone">
        <div className="absolute inset-0 opacity-30">
          <img src={summerHero} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/80 to-ink/40" />
        </div>
        <div className="container relative py-20 text-center md:py-32">
          <SectionLabel index="06" label="The Cut" dark />
          <h2 className="mx-auto mt-6 max-w-4xl font-display text-6xl uppercase leading-[0.85] md:text-8xl">
            This summer changes
            <br />
            <span className="text-orange">everything.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl font-ui text-lg text-bone/80 md:text-xl">
            Registration is right here on this page. The schedule is summer
            only. Sign up the athlete who's ready for the work.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <a
              href="#register"
              onClick={jumpToRegistration(primaryPackage)}
              className="btn-brutal"
            >
              Start Registration →
            </a>
            <a
              href={`mailto:${CONTACT_EMAIL}?subject=Workhouse%20Warrior%20Summer%20Inquiry`}
              className="inline-flex items-center gap-2 border-2 border-bone px-6 py-3 font-mono-display text-sm uppercase tracking-wider text-bone transition-colors hover:bg-bone hover:text-ink"
            >
              Questions? Email Us
            </a>
          </div>
        </div>
      </section>

      <footer className="border-t-2 border-ink bg-bone">
        <div className="container grid items-center gap-6 py-10 md:grid-cols-3">
          <div className="flex items-center gap-3">
            <img
              src={workhouseLogo}
              alt="Workhouse"
              className="h-9 w-9 object-contain"
            />
            <div className="font-mono-display text-xs uppercase tracking-[0.25em] text-ink/70">
              © {new Date().getFullYear()} DSC Hoops · Workhouse Basketball
            </div>
          </div>
          <div className="font-mono-display text-xs uppercase tracking-[0.25em] text-ink/70 md:text-center">
            Warrior Summer · Executive Health Club
          </div>
          <div className="md:text-right">
            <a
              href="#top"
              className="font-mono-display text-xs uppercase tracking-[0.25em] hover:text-orange"
            >
              Back to Top ↑
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Summer;
