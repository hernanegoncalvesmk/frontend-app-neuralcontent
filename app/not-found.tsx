"use client";

import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="bg-white dark:bg-[#0a0e19] py-[30px] h-screen overflow-x-hidden mb-[25px]">
      <div className="w-full h-full table">
        <div className="table-cell align-middle">
          <div className="mx-auto max-w-[960px] text-center">
            <Image
              src="/images/error.png"
              className="inline-block"
              alt="error-image"
              width={400}
              height={400}
            />
            <h4 className="!text-[19px] md:!text-[21px] !mt-[25px] md:!mt-[33px] !mb-[13px]">
              Página não encontrada
            </h4>
            <p className="mb-6">
              A página que você está procurando não existe ou foi movida.
            </p>
            <div className="space-y-3">
              <Link
                href="/dashboard"
                className="inline-block font-medium rounded-md md:text-md py-[12px] px-[25px] text-white bg-primary-500 transition-all hover:bg-primary-400 mr-3"
              >
                Ir para Dashboard
              </Link>
              <Link
                href="/auth/login"
                className="inline-block font-medium rounded-md md:text-md py-[12px] px-[25px] text-primary-500 bg-transparent border border-primary-500 transition-all hover:bg-primary-50"
              >
                Fazer Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
