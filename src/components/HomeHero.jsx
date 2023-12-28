"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { RocketIcon } from "@radix-ui/react-icons"
import FeatureImage from "@/assets/images/mindmap-couple-f336ec3f159a99a977df5fbd3c1fc49e946dde2af9d5bcec035abb45f78d09cf.svg"

const variants = {
  hidden: { scale: 0.9, opacity: 0 },
  enter: { scale: 1, opacity: 1 },
}

export default function HomeHero({ id, tryToken }) {
  return (
    <div className="border-b">
      <div className="container min-h-[760px] flex flex-col-reverse lg:flex-row items-center justify-evenly lg:justify-between relative">
        <div className="text-center lg:text-left relative z-10 sm:px-12">
          <h1 className="text-4xl leading-[48px] lg:text-5xl lg:leading-[72px] font-bold">
            Vẽ sơ đồ tư duy online,
            <br />
            miễn phí trọn đời.
          </h1>

          <p className="text-xl leading-8 text-zinc-400 font-light my-6 lg:mr-8">
            Tạo sơ đồ tư duy chỉ trong vài phút với Mindmap Flow, công cụ tạo bản đồ tư duy đơn giản và nhanh nhất.
          </p>

          <div className="flex gap-x-3 justify-center lg:justify-start">
            <Link href={`/mindmap/${id}?tryToken=${tryToken}`}>
              <Button className="h-12 lg:px-6 text-md w-full sm:w-auto">
                <RocketIcon className="mr-3 h-6 w-6" />
                Bắt đầu dùng thử
              </Button>
            </Link>
            <Button variant="outline" className="hidden sm:flex h-12 lg:px-6 text-md">
              Đăng ký miễn phí
            </Button>
          </div>
        </div>

        <div>
          <div className="w-full h-full absolute overflow-hidden top-0 bg-hero-overlay [transform:scale(2)translateZ(0)]"></div>
          <motion.div variants={variants} initial="hidden" animate="enter" transition={{ type: "tween" }}>
            <Image
              width={0}
              height={0}
              sizes="100vh"
              src={FeatureImage}
              alt="Feature Image"
              className="relative sm:max-w-[480px]"
            />
          </motion.div>
        </div>
      </div>
    </div>
  )
}
