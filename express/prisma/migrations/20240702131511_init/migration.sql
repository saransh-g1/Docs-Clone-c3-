-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Docs" (
    "id" SERIAL NOT NULL,
    "ops" TEXT NOT NULL,
    "userId" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "UserConnectedToDocs" (
    "id" SERIAL NOT NULL,
    "docsId" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "UserConnectedInDiffDocs" (
    "id" SERIAL NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Docs_id_key" ON "Docs"("id");

-- CreateIndex
CREATE UNIQUE INDEX "UserConnectedToDocs_id_key" ON "UserConnectedToDocs"("id");

-- CreateIndex
CREATE UNIQUE INDEX "UserConnectedInDiffDocs_id_key" ON "UserConnectedInDiffDocs"("id");

-- AddForeignKey
ALTER TABLE "Docs" ADD CONSTRAINT "Docs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserConnectedToDocs" ADD CONSTRAINT "UserConnectedToDocs_docsId_fkey" FOREIGN KEY ("docsId") REFERENCES "Docs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
