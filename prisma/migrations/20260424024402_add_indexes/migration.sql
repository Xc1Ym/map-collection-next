-- CreateIndex
CREATE INDEX "business_tags_business_id_idx" ON "business_tags"("business_id");

-- CreateIndex
CREATE INDEX "business_tags_tag_id_idx" ON "business_tags"("tag_id");

-- CreateIndex
CREATE INDEX "businesses_created_at_idx" ON "businesses"("created_at");
