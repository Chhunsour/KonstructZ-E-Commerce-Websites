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

export const MiniSkidSteerAttachments: React.FC = () => {
  const { t } = useI18n();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const items: AttachmentItem[] = [
    {
      id: "auger-drive",
      name: t("auto.miniskidsteerattachments.planetary.auger.drives"),
      category: "Drilling",
      image: "https://c.animaapp.com/9h31joeZ/img/new-project--19--3@2x.png",
      tagline: "High-torque planetary auger drives for fast, repeatable bore holes from the skid steer plate.",
      specs: [
        { label: t("auto.miniskidsteerattachments.mount.type"), value: t("auto.miniskidsteerattachments.universal.quick.attach") },
        { label: t("auto.miniskidsteerattachments.max.torque"), value: "Varies by drive model" },
        { label: t("auto.miniskidsteerattachments.bits.supported"), value: "Depends on selected setup" },
      ],
    },
    {
      id: "skeleton-bucket",
      name: t("auto.miniskidsteerattachments.skeleton.aggregates.buckets"),
      category: "Sorting",
      image: "https://c.animaapp.com/9h31joeZ/img/mini-excavator-png-4-1.png",
      tagline: t("auto.miniskidsteerattachments.sift.soil.and"),
      specs: [
        { label: t("auto.miniskidsteerattachments.sieve.opening"), value: "Varies by bucket configuration" },
        { label: t("auto.miniskidsteerattachments.bucket.width"), value: "Depends on selected width" },
        { label: t("auto.miniskidsteerattachments.cutting.edge"), value: t("auto.miniskidsteerattachments.bolt.on.dual") },
      ],
    },
  ];

  return (
    <div className="bg-brand-beige/10 min-h-screen pt-32 pb-24 text-brand-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-brand-green text-sm uppercase tracking-widest font-googleSans font-bold block">{t("auto.miniskidsteerattachments.konstructz.utilities")}</span>
          <h1 className="text-4xl md:text-6xl font-heading uppercase tracking-wide">{t("auto.miniskidsteerattachments.mini.skid.steer")}</h1>
          <div className="w-16 h-1 bg-brand-green mx-auto my-2" />
          <p className="text-neutral-600 font-glonimove text-base leading-relaxed">{t("auto.miniskidsteerattachments.expand.the.capability")}</p>
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
                >{t("auto.miniskidsteerattachments.request.quote")}</Link>
              </div>
            </div>
          ))}
        </div>

        <AttachmentInfo
          scope="skid steer"
          intro="A skid steer is only as productive as the attachment library it can run. The same chassis becomes a drill, a sorter, a snow pusher, a grapple, a sweeper or a trencher — depending on what's mounted to the plate. Konstructz attachments are built around the way skid steers are actually worked: hard cycles, fast swaps, varied ground."
          benefits={[
            "Universal quick-attach plate for fast tool changes",
            "Hardened wear steel sized for daily skid steer cycles",
            "Matched to common standard-flow hydraulic specs",
            "Replaceable wear parts to extend tool life",
            "Backed by Konstructz parts and fitment support",
          ]}
          compatibility="Most Konstructz skid steer attachments mount on a universal quick-attach plate, so they fit a wide range of compact and standard skid steers. Flow class matters — high-flow attachments like augers and breakers require a machine rated for high flow. Send us your machine specs before ordering and we will confirm fitment."
          faqs={[
            {
              q: "Will Konstructz attachments fit any skid steer?",
              a: "Most do. The universal quick-attach plate is the common standard across skid steers. Some compact loaders use a smaller plate — confirm the plate style and hydraulic flow with our team before ordering.",
            },
            {
              q: "What is standard-flow vs high-flow on a skid steer?",
              a: "Flow describes hydraulic gallons per minute. Standard-flow covers most attachments. High-flow attachments — mulchers, cold planers, large augers — need a machine rated for high flow or they will starve.",
            },
            {
              q: "How fast can I swap attachments?",
              a: "With a quick-attach plate, most attachments swap in a few minutes from the seat — connect the plate, hook the hydraulic couplers, run the tool.",
            },
            {
              q: "Can I run snow attachments on a skid steer year-round?",
              a: "Yes — pushers, blades, snow buckets and brooms turn a skid steer into a winter machine, which extends payback by adding a whole season of utilization.",
            },
          ]}
        />

      </div>
    </div>
  );
};

export default MiniSkidSteerAttachments;
