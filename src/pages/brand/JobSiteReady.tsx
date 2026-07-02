import { useI18n } from "../../context/I18nContext";
import React from "react";
import { BrandPillarPage } from "./BrandPillarPage";

export const JobSiteReady: React.FC = () => {
  const { t } = useI18n();
  return (
    <BrandPillarPage
      documentTitle={t("auto.jobsiteready.job.site.ready")}
      metaDescription={t("auto.jobsiteready.konstructz.equipment.is")}
      eyebrow={t("auto.jobsiteready.brand.pillar")}
      title={t("auto.jobsiteready.job.site.ready")}
      intro={t("auto.jobsiteready.practical.machines.designed")}
      heroImage="/img/site-engineer-construction-site-1.webp"
      stats={[
        { value: "5+", label: t("auto.jobsiteready.label") },
        { value: "13", label: t("auto.jobsiteready.models.in.stock") },
        { value: "PDI", label: t("auto.jobsiteready.pre.delivery.checked") },
        { value: "QA", label: t("auto.jobsiteready.universal.quick.attach") },
      ]}
    lead={t("auto.jobsiteready.every.unit.ships")}
    blocks={[
      {
        badge: "01",
        title: t("auto.jobsiteready.construction.crews"),
        body: t("auto.jobsiteready.foundation.prep.backfill"),
      },
      {
        badge: "02",
        title: "Landscaping & site work",
        body: t("auto.jobsiteready.slim.bodies.retractable"),
      },
      {
        badge: "03",
        title: t("auto.jobsiteready.material.handling"),
        body: t("auto.jobsiteready.pallet.forks.buckets"),
      },
      {
        badge: "04",
        title: t("auto.jobsiteready.daily.worksite.tasks"),
        body: t("auto.jobsiteready.steady.hydraulics.simple"),
      },
    ]}
    callouts={[
      t("auto.jobsiteready.compact.enough.for"),
      t("auto.jobsiteready.universal.quick.attach"),
      t("auto.jobsiteready.ready.for.common"),
      t("auto.jobsiteready.operator.friendly.controls"),
      t("auto.jobsiteready.trailerable.with.standard"),
    ]}
    ctaTitle={t("auto.jobsiteready.match.a.machine")}
    ctaBody={t("auto.jobsiteready.tell.us.what")}
    primaryCta={{ label: t("auto.jobsiteready.view.equipment"), href: "/equipment/konstructz-machine" }}
    secondaryCta={{ label: t("auto.jobsiteready.contact.us"), href: "/contact" }}
    />
  );
};

export default JobSiteReady;
