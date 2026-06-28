import { useI18n } from "../context/I18nContext";
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { AttachmentInfo } from "../components/sections/AttachmentInfo";

interface AttachmentItem {
  id: string;
  name: string;
  category: string;
  image: string;
  tagline: string;
  specs: { label: string; value: string }[];
}

export const Attachments: React.FC = () => {
  const { t } = useI18n();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const items: AttachmentItem[] = [
    {
      id: "auger-drive",
      name: t("auto.attachments.planetary.auger.drives"),
      category: t("attachments.category.drilling", { fallback: "Drilling" }),
      image: "https://c.animaapp.com/9h31joeZ/img/new-project--19--3@2x.png",
      tagline: t("attachments.item.auger.tagline", { fallback: "High-torque gears for deep boring operations" }),
      specs: [
        { label: t("auto.attachments.mount.type"), value: t("auto.attachments.universal.quick.attach") },
        { label: t("auto.attachments.max.torque"), value: "2,800 Nm (2,065 ft-lbs)" },
        { label: t("auto.attachments.bits.supported"), value: "6\" to 30\" (150-750mm) Bits" },
      ],
    },
    {
      id: "excavator-thumb",
      name: t("auto.attachments.hydraulic.excavator.thumbs"),
      category: t("attachments.category.handling", { fallback: "Handling" }),
      image: "https://c.animaapp.com/9h31joeZ/img/new-project--16--2@2x.png",
      tagline: t("auto.attachments.heavy.steel.clamp"),
      specs: [
        { label: t("attachments.spec.material", { fallback: "Material" }), value: t("attachments.spec.material.value", { fallback: "High-Tensile Hardox Steel" }) },
        { label: t("attachments.spec.operation", { fallback: "Operation" }), value: t("auto.attachments.hydraulic.cylinder.dual") },
        { label: t("attachments.spec.compatibility", { fallback: "Compatibility" }), value: t("auto.attachments.kuvuo.and.scoopydig") },
      ],
    },
    {
      id: "concrete-breaker",
      name: t("auto.attachments.hydraulic.hammers.breakers"),
      category: t("attachments.category.demolition", { fallback: "Demolition" }),
      image: "https://c.animaapp.com/9h31joeZ/img/groundripper-png-4@2x.png",
      tagline: t("auto.attachments.carving.concrete.pavement"),
      specs: [
        { label: t("auto.attachments.impact.rate"), value: "500 - 1,200 bpm" },
        { label: t("auto.attachments.oil.flow.range"), value: "25 - 50 L/min (6.6-13.2 gpm)" },
        { label: t("auto.attachments.impact.energy"), value: "450 Joules (330 ft-lbs)" },
      ],
    },
    {
      id: "skeleton-bucket",
      name: t("auto.attachments.skeleton.aggregates.buckets"),
      category: t("attachments.category.sorting", { fallback: "Sorting" }),
      image: "https://c.animaapp.com/9h31joeZ/img/mini-excavator-png-4-1.png",
      tagline: t("auto.attachments.sift.soil.and"),
      specs: [
        { label: t("auto.attachments.sieve.opening"), value: "3\" x 3\" (75mm) Grid" },
        { label: t("auto.attachments.bucket.width"), value: "36\" to 48\" (915-1220mm)" },
        { label: t("auto.attachments.cutting.edge"), value: t("auto.attachments.bolt.on.dual") },
      ],
    },
  ];

  return (
    <div className="bg-brand-beige/10 min-h-screen pt-32 pb-24 text-brand-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-brand-green text-sm uppercase tracking-widest font-googleSans font-bold block">{t("auto.attachments.konstructz.utilities")}</span>
          <h1 className="text-4xl md:text-6xl font-heading uppercase tracking-wide">{t("auto.attachments.engineered.attachments")}</h1>
          <div className="w-16 h-1 bg-brand-green mx-auto my-2" />
          <p className="text-neutral-600 font-glonimove text-base leading-relaxed">
            {t("attachments.introText", { fallback: "Expand what your loader, skid steer or excavator can do. Konstructz attachments are engineered around real jobsite wear, matched coupler setups, and hydraulic fitment checks so you can move between digging, lifting, breaking and sorting with confidence." })}
          </p>
        </div>

        {/* Catalog List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-brand-green/10 rounded-lg overflow-hidden flex flex-col sm:flex-row group shadow-sm hover:shadow transition-shadow"
            >
              {/* Image */}
              <div className="sm:w-1/2 aspect-video sm:aspect-square bg-neutral-100 p-6 flex items-center justify-center">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Data content */}
              <div className="p-6 sm:w-1/2 flex flex-col justify-between">
                <div>
                  <span className="text-xs uppercase tracking-widest text-brand-military font-googleSans font-bold block mb-1">
                    {item.category}
                  </span>
                  <h2 className="text-2xl font-heading text-brand-dark">
                    {item.name}
                  </h2>
                  <p className="text-neutral-500 font-glonimove text-xs mt-2 leading-relaxed">
                    {item.tagline}
                  </p>
                </div>

                {/* Specs list */}
                <div className="my-6 space-y-1.5 font-googleSans text-xs text-neutral-700">
                  {item.specs.map((spec) => (
                    <div key={spec.label} className="flex justify-between border-b pb-1">
                      <span className="text-neutral-400">{spec.label}</span>
                      <span className="font-bold text-brand-dark">{spec.value}</span>
                    </div>
                  ))}
                </div>

                <Link
                  to={`/contact?attachment=${item.id}`}
                  className="w-full text-center py-2.5 font-googleSans font-bold text-sm tracking-wider bg-brand-greenDark text-brand-sand hover:bg-brand-green hover:text-white transition-colors duration-300 uppercase"
                >{t("auto.attachments.request.quote")}</Link>
              </div>
            </div>
          ))}
        </div>

        {/* Universal connection highlight */}
        <div className="bg-brand-dark border-2 border-brand-sand/30 text-white rounded-lg p-8 md:p-12 text-center max-w-4xl mx-auto space-y-6">
          <h2 className="text-2xl md:text-3xl font-heading text-brand-sand uppercase tracking-wider">{t("auto.attachments.universal.mount.compatibility")}</h2>
          <p className="text-neutral-300 font-glonimove font-light leading-relaxed max-w-2xl mx-auto text-sm md:text-base">{t("auto.attachments.all.attachments.use")}</p>
          <div className="inline-flex gap-4">
            <Link to="/contact">
              <Button variant="sand">{t("auto.attachments.consult.with.engineer")}</Button>
            </Link>
          </div>
        </div>

        <AttachmentInfo
          scope="machine"
          intro={t("attachments.info.intro", { fallback: "An attachment is the difference between a one-job machine and a multi-job machine. The right work tool turns the same loader or excavator into a trencher, breaker, auger drill, grapple, or material sorter — so you get more billable hours per machine and spend less on rental, transport and fleet count." })}
          benefits={[
            t("attachments.info.benefit.1", { fallback: "High-tensile wear steel built for continuous daily cycles" }),
            t("attachments.info.benefit.2", { fallback: "Quick-attach and pin-on options matched to machine setup" }),
            t("attachments.info.benefit.3", { fallback: "Sized to common machine flow and pressure classes" }),
            t("attachments.info.benefit.4", { fallback: "Replaceable wear edges and teeth to extend service life" }),
            t("attachments.info.benefit.5", { fallback: "Backed by the Konstructz parts and support team" }),
          ]}
          compatibility={t("attachments.info.compatibility", { fallback: "Attachment fit depends on coupler style, pin size, machine weight class, hydraulic flow, pressure range, and any electrical requirements. Before ordering, send us your machine model and we will confirm the safest attachment path." })}
          faqs={[
            {
              q: t("attachments.info.faq.1.q", { fallback: "Will Konstructz attachments fit other brands of machine?" }),
              a: t("attachments.info.faq.1.a", { fallback: "Many can be matched across compatible coupler systems. Confirm coupler type, pin size, machine weight class, and hydraulic flow with our team before you order and we will identify the right unit." }),
            },
            {
              q: t("attachments.info.faq.2.q", { fallback: "What is the difference between standard-flow and high-flow attachments?" }),
              a: t("attachments.info.faq.2.a", { fallback: "Flow classes describe the hydraulic demand of a powered attachment. Running a tool on the wrong hydraulic setup can underperform, overheat oil, or shorten seal life. Always match the attachment to the machine before purchase." }),
            },
            {
              q: t("attachments.info.faq.3.q", { fallback: "Can I run more than one attachment from a single hydraulic line?" }),
              a: t("attachments.info.faq.3.a", { fallback: "Not at the same time. With a quick-coupler you can swap between attachments in minutes — one line, one tool active at a time." }),
            },
            {
              q: t("attachments.info.faq.4.q", { fallback: "Do attachments come with a warranty?" }),
              a: t("attachments.info.faq.4.a", { fallback: "Yes. Konstructz attachments carry a manufacturer warranty against defects. Wear parts (teeth, cutting edges, bits) are consumables and are not covered by the warranty but are kept in stock for fast replacement." }),
            },
          ]}
        />

      </div>
    </div>
  );
};
export default Attachments;
