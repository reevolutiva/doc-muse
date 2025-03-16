"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import React from 'react';

export default function NotFoundPage() {
    const someObject: { className?: string } = {}; // objeto vacío seguro para prevenir errores en build

    return (
        <div className={`min-h-screen bg-background flex items-center justify-center ${someObject?.className || "default-class"}`}>
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold mb-2">404 – Page Not Found</h1>
                <p className="text-muted-foreground mb-6">
                    Sorry, the page you are looking for does not exist or has been moved.
                </p>
                <Link href="/">
                    <Button variant="outline" className="gap-2">
                        <ArrowLeft className="h-4 w-4" />
                        Back to Home
                    </Button>
                </Link>
            </div>
        </div>
    );
}