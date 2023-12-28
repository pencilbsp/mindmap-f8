import { randomUUID } from "crypto"
import { getServerSession } from "next-auth"
import { notFound, redirect } from "next/navigation"

import prisma from "@/lib/prisma"
import { PATHS } from "@/configs"
import { decryptData } from "@/lib/aes"
import { authOptions } from "@/lib/auth"
import getRedisClient from "@/lib/redis"
import Collaborative from "@/components/flow/Collaborative"
import { Flow, FlowToolbar, FlowProvider } from "@/components/flow"

export default async function MindmapPage({ params, searchParams }) {
  let mindmap
  let tryToken = searchParams.tryToken
  let mindmapId = params.mindmapId?.[0]

  const redisClient = await getRedisClient()
  const session = await getServerSession(authOptions)

  // TH1: Nếu người dùng chưa đăng nhập
  if (!session) {
    // Nếu không có mindmap id thì chuyển hướng yêu cầu đăng nhập
    if (!mindmapId) return redirect(PATHS.auth.login)

    // Tìm kiếm mindmap public được chia sẻ
    const existPublicMindmap = await prisma.mindmap.findUnique({ where: { id: mindmapId, isPublic: true } })

    /**
     * Nếu không phải một mindmap public
     * thì tiến hành khởi tạo phiên dùng thử
     */
    if (!existPublicMindmap) {
      // Nếu không có tryToken chuyển hướng về trang chủ để tạo tryToken
      if (!tryToken) return redirect(PATHS.home)

      try {
        tryToken = decryptData(tryToken)
        const token = await redisClient.get(tryToken.id)
        if (!token || token !== searchParams.tryToken) throw new Error("Token không hợp lệ hoặc đã hết hạn")

        /**
         * Khởi tạo phiên dùng thử
         * Đặt isDraft = true
         * Phiên dùng thử được lưu trữ dữ liệu phía trình duyệt
         */
        mindmapId = tryToken.id
        mindmap = { id: tryToken.id, isDraft: true, allowEdit: true }
      } catch (error) {
        /**
         * Nếu tryToken hết hạn hoặc lỗi
         * thì chuyển hướng về trang chủ
         */

        !isProduction && console.log(error)
        return redirect(PATHS.home)
      }
    } else {
      mindmap = existPublicMindmap
    }

    // TH2: Người dùng đã đăng nhập
  } else {
    // Tạo id cho mindmap mới
    if (!mindmapId) {
      mindmapId = randomUUID()
      await prisma.mindmap.create({
        data: {
          id: mindmapId,
          userId: session.user.id,
        },
      })

      return redirect(`${PATHS.mindmap}/${mindmapId}`)
    }

    const isTryMindmap = await redisClient.get(mindmapId)
    if (isTryMindmap) {
      mindmap = {
        id: mindmapId,
        allowEdit: true,
      }

      // Lưu phiên dùng thử nếu người dùng đã đăng nhập
      await redisClient.del(mindmapId)
      await prisma.mindmap.create({
        data: {
          id: mindmapId,
          userId: session.user.id,
        },
      })
    } else {
      // Tìm kiếm mindmap theo id và id người dùng
      const existMindmap = await prisma.mindmap.findUnique({ where: { id: mindmapId } })

      // Nếu không tồn tại thì chuyển hướng tới trang not found
      if (!existMindmap) return notFound()
      if (existMindmap.userId !== session.user.id && !existMindmap.isPublic) return notFound()

      mindmap = {
        ...existMindmap,
        allowEdit: existMindmap.userId === session.user.id ? true : existMindmap.allowEdit,
      }
    }
  }

  return (
    <main className="h-dvh">
      <FlowProvider initData={mindmap ?? { id: mindmapId, isDraft }} userId={session?.user.id}>
        <FlowToolbar user={session?.user} mindmapId={mindmapId} />
        <div className="flex w-full h-[calc(100%-64px)]">
          <Collaborative />
          <Flow />
        </div>
      </FlowProvider>
    </main>
  )
}
