import { useI18n } from "../../context/I18nContext";
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { AttachmentInfo } from "../../components/sections/AttachmentInfo";

interface AttachmentItem {
  id: string;
  name: string;
  category: string;
  image: string;
  tagline: string;
  specs: { label: string; value: string }[];
}

export const MiniExcavatorAttachments: React.FC = () => {
  const { t } = useI18n();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const items: AttachmentItem[] = [
    {
      id: "excavator-thumb",
      name: t("auto.miniexcavatorattachments.hydraulic.excavator.thumbs"),
      category: "Handling",
      image: "https://c.animaapp.com/9h31joeZ/img/new-project--16--2@2x.png",
      tagline: t("auto.miniexcavatorattachments.heavy.steel.clamp"),
      specs: [
        { label: "Material", value: "High-Tensile Hardox Steel" },
        { label: "Operation", value: t("auto.miniexcavatorattachments.hydraulic.cylinder.dual") },
        { label: "Compatibility", value: t("auto.miniexcavatorattachments.kuvuo.and.scoopydig") },
      ],
    },
    {
      id: "concrete-breaker",
      name: t("auto.miniexcavatorattachments.hydraulic.hammers.breakers"),
      category: "Demolition",
      image: "https://c.animaapp.com/9h31joeZ/img/groundripper-png-4@2x.png",
      tagline: t("auto.miniexcavatorattachments.carving.concrete.pavement"),
      specs: [
        { label: t("auto.miniexcavatorattachments.impact.rate"), value: "500 - 1,200 bpm" },
        { label: t("auto.miniexcavatorattachments.oil.flow.range"), value: "25 - 50 L/min (6.6-13.2 gpm)" },
        { label: t("auto.miniexcavatorattachments.impact.energy"), value: "450 Joules (330 ft-lbs)" },
      ],
    },
    {
      id: "auger-drive",
      name: t("auto.miniexcavatorattachments.planetary.auger.drives"),
      category: "Drilling",
      image: "https://c.animaapp.com/9h31joeZ/img/new-project--19--3@2x.png",
      tagline: "High-torque planetary auger drives for clean, repeatable bore holes in soil, clay and root-bound ground.",
      specs: [
        { label: t("auto.miniexcavatorattachments.mount.type"), value: t("auto.miniexcavatorattachments.universal.quick.attach") },
        { label: t("auto.miniexcavatorattachments.max.torque"), value: "2,800 Nm (2,065 ft-lbs)" },
        { label: t("auto.miniexcavatorattachments.bits.supported"), value: "6\" to 30\" (150-750mm) Bits" },
      ],
    },
    {
      id: "skeleton-bucket",
      name: t("auto.miniexcavatorattachments.skeleton.aggregates.buckets"),
      category: "Sorting",
      image: "https://c.animaapp.com/9h31joeZ/img/mini-excavator-png-4-1.png",
      tagline: t("auto.miniexcavatorattachments.sift.soil.and"),
      specs: [
        { label: t("auto.miniexcavatorattachments.sieve.opening"), value: "3\" x 3\" (75mm) Grid" },
        { label: t("auto.miniexcavatorattachments.bucket.width"), value: "36\" to 48\" (915-1220mm)" },
        { label: t("auto.miniexcavatorattachments.cutting.edge"), value: t("auto.miniexcavatorattachments.bolt.on.dual") },
      ],
    },
  ];

  return (
    <div className="bg-brand-beige/10 min-h-screen pt-32 pb-24 text-brand-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-brand-green text-sm uppercase tracking-widest font-googleSans font-bold block">{t("auto.miniexcavatorattachments.konstructz.utilities")}</span>
          <h1 className="text-4xl md:text-6xl font-heading uppercase tracking-wide">{t("auto.miniexcavatorattachments.mini.excavator.attachments")}</h1>
          <div className="w-16 h-1 bg-brand-green mx-auto my-2" />
          <p className="text-neutral-600 font-glonimove text-base leading-relaxed">
            Turn one mini excavator into a multi-tool machine. Konstructz thumbs, breakers, buckets and augers are engineered to fit your boom seamlessly — so you can dig, grab, break and bore from the same seat without trading machines mid-project.
          </p>
        </div>

        {/* Catalog List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-brand-green/10 rounded-lg overflow-hidden flex flex-col sm:flex-row group shadow-sm hover:shadow transition-shadow"
            >
              <div className="sm:w-1/2 aspect-video sm:aspect-square bg-neutral-100 p-6 flex items-center justify-center">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                />
              </div>

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
                >{t("auto.miniexcavatorattachments.request.quote")}</Link>
              </div>
            </div>
          ))}
        </div>

        <AttachmentInfo
          scope="mini excavator"
          intro="A mini excavator earns more billable hours when it can do more than dig. The right thumb turns it into a material handler. A breaker turns it into a demolition tool. An auger turns it into a post-and-pole drill. A skeleton bucket turns it into a sorter. The boom doesn't change — the attachment does."
          benefits={[
            "Pin-on or quick-coupler mounting to match your machine",
            "Hardened wear steel for daily cycles in abrasive ground",
            "Sized to common compact-excavator hydraulic flow",
            "Replaceable teeth, edges and bits to extend service life",
            "Backed by the Konstructz attachments support team",
          ]}
          compatibility="Konstructz mini excavator attachments are sized for compact-excavator boom geometry and hydraulic flow. Coupler types and pin sizes vary across machines — share your model and serial range with the team and we will confirm fitment before you order."
          faqs={[
            {
              q: "Will these attachments fit my mini excavator?",
              a: "Most do, but pin diameter and coupler style vary across brands and weight classes. Send us your machine model and serial range and we will confirm pin size, coupler and hydraulic flow before quoting.",
            },
            {
              q: "Do I need auxiliary hydraulics for an attachment?",
              a: "Powered attachments — breakers, augers, thumbs with hydraulic action — need an auxiliary hydraulic circuit on the boom. Mechanical attachments like rigid thumbs and standard buckets do not.",
            },
            {
              q: "How long should an auger bit or breaker tool last?",
              a: "Service life depends on ground class, downtime maintenance, and operator technique. Konstructz keeps replacement bits, teeth and breaker tools in stock so wear-out doesn't become downtime.",
            },
            {
              q: "Can I swap attachments mid-day?",
              a: "Yes — that is the point of a quick-coupler. Most operators can swap in a few minutes between digging, breaking, drilling and grading without leaving the seat.",
            },
          ]}
        />

      </div>
    </div>
  );
};

export default MiniExcavatorAttachments;
