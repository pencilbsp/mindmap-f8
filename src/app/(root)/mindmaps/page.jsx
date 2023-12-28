import Link from "next/link"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

import { PATHS } from "@/configs"
import prisma from "@/lib/prisma"
import { authOptions } from "@/lib/auth"
import DeleteButton from "./DeleteButton"
import { formatDate, formatToNow } from "@/lib/format-date"

export const metadata = {
  title: "Bản đồ tư duy của tôi",
  description: "Danh sách các bản đồ tư duy của tôi",
}

export default async function MyMindmaps() {
  const session = await getServerSession(authOptions)
  if (!session) return redirect(PATHS.auth.login)

  const mindmaps = await prisma.mindmap.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      updatedAt: "desc",
    },
  })

  return (
    <div className="container">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tên</TableHead>
            <TableHead>Thời gian tạo</TableHead>
            <TableHead>Sửa đổi lần cuối</TableHead>
            <TableHead className="text-right">Hành động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mindmaps.map((mindmap) => {
            return (
              <TableRow key={mindmap.id}>
                <TableCell className="font-medium">
                  <Link href={`${PATHS.mindmap}/${mindmap.id}`}>{mindmap.name ?? "Chưa đặt tên"}</Link>
                </TableCell>
                <TableCell>{formatDate(mindmap.createdAt)}</TableCell>
                <TableCell>{formatToNow(mindmap.updatedAt)}</TableCell>
                <TableCell className="text-right">
                  <DeleteButton id={mindmap.id} />
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
