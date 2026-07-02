import { useI18n } from "../../context/I18nContext";
import React from "react";
import { BrandPillarPage } from "./BrandPillarPage";

export const QualityEquipment: React.FC = () => {
  const { t } = useI18n();
  return (
    <BrandPillarPage
      documentTitle={t("auto.qualityequipment.quality.equipment.konstructz")}
      metaDescription={t("auto.qualityequipment.konstructz.machinery.is")}
      eyebrow={t("auto.qualityequipment.brand.pillar")}
      title={t("auto.qualityequipment.quality.equipment.engineered")}
      intro={t("auto.qualityequipment.every.machine.in")}
      heroImage="/img/new-project-23-3.webp"
      stats={[
        { value: "PDI", label: t("auto.qualityequipment.pre.shipping.inspection") },
        { value: "Terms", label: t("auto.qualityequipment.standard.warranty") },
        { value: "Parts", label: t("auto.qualityequipment.parts.info.turnaround") },
        { value: "US", label: t("auto.qualityequipment.commerce.usa.depot") },
      ]}
      lead={t("auto.qualityequipment.we.don.t")}
      blocks={[
        {
          badge: "01",
          title: t("auto.qualityequipment.built.for.durability"),
          body: "Heavy-duty frames, reinforced lift arms and high-strength geometry are built around the way contractors actually work — long shifts, heavy cycles, and the kind of side-loading that quietly breaks lighter machines.",
        },
        {
          badge: "02",
          title: t("auto.qualityequipment.tested.performance"),
          body: t("auto.qualityequipment.engines.hydraulics.and"),
        },
        {
          badge: "03",
          title: t("auto.qualityequipment.job.site.conditions"),
          body: t("auto.qualityequipment.cooling.sealing.and"),
        },
        {
          badge: "04",
          title: t("auto.qualityequipment.practical.engineering"),
          body: t("auto.qualityequipment.universal.quick.attach"),
        },
      ]}
      callouts={[
        t("auto.qualityequipment.pre.delivery.inspection"),
        t("auto.qualityequipment.real.world.testing"),
        t("auto.qualityequipment.heavy.duty.components"),
        t("auto.qualityequipment.standardized.attachment.plates"),
        t("auto.qualityequipment.field.proven.cooling"),
      ]}
      ctaTitle={t("auto.qualityequipment.see.the.catalog")}
      ctaBody={t("auto.qualityequipment.browse.the.machines")}
      primaryCta={{ label: t("auto.qualityequipment.view.equipment"), href: "/equipment/konstructz-machine" }}
      secondaryCta={{ label: t("auto.qualityequipment.request.a.quote"), href: "/contact" }}
    />
  );
};

export default QualityEquipment;
