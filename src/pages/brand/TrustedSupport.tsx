import { useI18n } from "../../context/I18nContext";
import React from "react";
import { BrandPillarPage } from "./BrandPillarPage";

export const TrustedSupport: React.FC = () => {
  const { t } = useI18n();
  return (
    <BrandPillarPage
      documentTitle={t("auto.trusted.trusted.support.konstructz")}
      metaDescription={t("auto.trusted.pre.purchase.guidance")}
      eyebrow={t("auto.trusted.brand.pillar")}
      title={t("auto.trusted.trusted.support.before")}
      intro={t("auto.trusted.choosing.the.right")}
      heroImage="/img/engineer-provides-technical-support-via-headset-solar-panel-fact.png"
      stats={[
        { value: "Online", label: t("auto.trusted.online.channels") },
        { value: "Direct", label: t("auto.trusted.email.response") },
        { value: "US", label: t("auto.trusted.based.in.commerce") },
        { value: "Human", label: t("auto.trusted.real.human.help") },
      ]}
      lead={t("auto.trusted.from.the.first")}
      blocks={[
        {
          badge: "01",
          title: t("auto.trusted.pre.purchase.guidance"),
          body: t("auto.trusted.tell.us.the"),
        },
        {
          badge: "02",
          title: t("auto.trusted.right.machine.right"),
          body: t("auto.trusted.we.walk.through"),
        },
        {
          badge: "03",
          title: t("auto.trusted.after.sales.support"),
          body: t("auto.trusted.operator.questions.attachment"),
        },
        {
          badge: "04",
          title: t("auto.trusted.parts.service.info"),
          body: t("auto.trusted.we.help.you"),
        },
      ]}
      callouts={[
        t("auto.trusted.talk.to.a"),
        t("auto.trusted.honest.sizing.recommendations"),
        t("auto.trusted.shipping.delivery.coordination"),
        t("auto.trusted.operator.and.maintenance"),
        t("auto.trusted.parts.and.consumables"),
      ]}
      ctaTitle={t("auto.trusted.got.a.job")}
      ctaBody={t("auto.trusted.tell.us.what")}
      primaryCta={{ label: t("auto.trusted.contact.us"), href: "/contact" }}
      secondaryCta={{ label: t("auto.trusted.browse.equipment"), href: "/equipment/konstructz-machine" }}
    />
  );
};

export default TrustedSupport;
