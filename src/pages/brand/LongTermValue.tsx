import { useI18n } from "../../context/I18nContext";
import React from "react";
import { BrandPillarPage } from "./BrandPillarPage";

export const LongTermValue: React.FC = () => {
  const { t } = useI18n();
  return (
    <BrandPillarPage
      documentTitle={t("auto.longtermvalue.long.term.value")}
      metaDescription={t("auto.longtermvalue.productivity.reliability.and")}
      eyebrow={t("auto.longtermvalue.brand.pillar")}
      title={t("auto.longtermvalue.long.term.value")}
      intro={t("auto.longtermvalue.equipment.that.earns")}
      heroImage="/img/businessman-holding-growth-arrow-1.webp"
      stats={[
        { value: "ROI", label: t("auto.longtermvalue.built.into.spec") },
        { value: "↓", label: t("auto.longtermvalue.lower.wasted.hours") },
        { value: "↑", label: t("auto.longtermvalue.higher.uptime") },
        { value: "$$", label: t("auto.longtermvalue.total.cost.transparent") },
      ]}
      lead={t("auto.longtermvalue.we.size.equipment")}
      blocks={[
        {
          badge: "01",
          title: t("auto.longtermvalue.productivity.per.hour"),
          body: t("auto.longtermvalue.right.sized.hydraulics"),
        },
        {
          badge: "02",
          title: t("auto.longtermvalue.reliability.over.time"),
          body: t("auto.longtermvalue.component.choices.and"),
        },
        {
          badge: "03",
          title: t("auto.longtermvalue.less.wasted.time"),
          body: t("auto.longtermvalue.standard.quick.attach"),
        },
        {
          badge: "04",
          title: t("auto.longtermvalue.better.return.on"),
          body: t("auto.longtermvalue.we.re.transparent"),
        },
      ]}
      callouts={[
        t("auto.longtermvalue.honest.total.cost"),
        t("auto.longtermvalue.spec.choices.tuned"),
        t("auto.longtermvalue.service.friendly.access"),
        t("auto.longtermvalue.common.parts.that"),
        t("auto.longtermvalue.equipment.selected.to"),
      ]}
      ctaTitle={t("auto.longtermvalue.run.the.numbers")}
      ctaBody={t("auto.longtermvalue.bring.your.project")}
      primaryCta={{ label: t("auto.longtermvalue.request.a.quote"), href: "/contact" }}
      secondaryCta={{ label: t("auto.longtermvalue.view.equipment"), href: "/equipment/konstructz-machine" }}
    />
  );
};

export default LongTermValue;
