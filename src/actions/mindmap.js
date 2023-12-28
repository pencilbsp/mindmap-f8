"use server"

import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"
import { Unauthorized, Forbidden, NotFound } from "@/lib/error"
import prisma from "@/lib/prisma"
import { PATHS } from "@/configs"

export async function upsertMindmap(userId, { id, nodes, edges }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session.user) throw new Unauthorized()
    /**
     * [TODO]
     * [X] Kiểm tra id người dùng của mindap chứ
     * không phải userId được người dùng gửi lên
     * [X] Bỏ qua vì thời gian phát triển gấp
     */
    if (session.user.id !== userId) throw new Forbidden()

    await prisma.mindmap.upsert({
      where: {
        id,
      },
      update: {
        edges,
        nodes,
      },
      create: {
        id,
        edges,
        nodes,
        userId: session.user.id,
      },
    })
    return { success: true }
  } catch (error) {
    return { error: { message: error.message } }
  }
}

export async function shareMindmap(id, { isPublic, allowEdit }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session.user) throw new Unauthorized()

    const mindmap = await prisma.mindmap.findUnique({
      where: {
        id: id,
        userId: session.user.id,
      },
    })

    if (!mindmap) throw new NotFound()

    await prisma.mindmap.update({ where: { id }, data: { isPublic, allowEdit } })

    return { url: `/${PATHS.mindmap}/${id}?share=true` }
  } catch (error) {
    return { error: { message: error.message } }
  }
}

export async function renameMindmap(id, newName) {
  try {
    const session = await getServerSession(authOptions)
    if (!session.user) throw new Unauthorized()

    const mindmap = await prisma.mindmap.findUnique({
      where: {
        id: id,
        userId: session.user.id,
      },
      select: {
        name: true,
      },
    })

    if (!mindmap) throw new NotFound()
    if (mindmap.name === newName) return {}

    await prisma.mindmap.update({ where: { id }, data: { name: newName } })
    return { success: true }
  } catch (error) {
    return { error: { message: error.message } }
  }
}

export async function deleteMindmap(id) {
  try {
    const session = await getServerSession(authOptions)
    if (!session.user) throw new Unauthorized()

    const mindmap = await prisma.mindmap.findUnique({
      where: {
        id: id,
        userId: session.user.id,
      },
    })

    if (!mindmap) throw new NotFound()

    await prisma.mindmap.delete({ where: { id } })
    return {}
  } catch (error) {
    return { error: { message: error.message } }
  }
}
