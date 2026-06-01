'use client';

import { useRef, useState } from 'react';
import { Documents } from './Document';
import SignaturePad from './SignaturePad';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import html2canvas from "html2canvas";

interface SignatureData {
    full: string;
    preview: string;
}

interface FormData {
    name: string;
    cpf: string;
    date: string;
    signature: SignatureData | null;
}

export function Forms() {
    const contentRef = useRef<HTMLDivElement>(null);
    const [formData, setFormData] = useState<FormData>({
        name: '',
        cpf: '',
        date: new Date().toISOString().split('T')[0],
        signature: null 
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSignatureSave = (signatureData: SignatureData) => {
        setFormData(prev => ({
            ...prev,
            signature: signatureData
        }));
    };

    const formatCPF = (cpf: string) => {
        const cleaned = cpf.replace(/\D/g, '');
        if (cleaned.length <= 11) {
            return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
        }
        return cpf;
    };

    async function generatePDF() {
        if (!formData.signature || !formData.name.trim() || !formData.cpf.trim()) {
            alert("Adicione a assinatura, nome e CPF, antes de gerar o PDF");
            return;
        }

        if (!contentRef.current) {
            console.error('Elemento não encontrado');
            return;
        }

        const canvas = await html2canvas(contentRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#fff",
        });

        const imgData = canvas.toDataURL("image/png");

        const pdf = new jsPDF("p", "mm", "a4");

        const pdfWidth = 210;

        const imgWidth = pdfWidth;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        pdf.addImage(
        imgData,
        "PNG",
        0,
        0,
        imgWidth,
        imgHeight
        );

        pdf.save("termo.pdf");
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="mx-auto max-w-[210mm] px-4">
                <div className="bg-white shadow-lg rounded-lg p-4">
                    <Documents />
                     <div className="mt-4 border-t pt-4">
                        <div className="space-y-2">
                            <div className="grid grid-cols-3 gap-4">
                                <div className="col-span-2">
                                    <p className="text-base">
                                        <span className="font-semibold">Nome: </span>
                                        {formData.name}
                                    </p>
                                </div>
                                <div className="flex-1">
                                    <p className="text-base">
                                        <span className="font-semibold">Data: </span>
                                        {new Date(formData.date).toLocaleDateString('pt-BR')}
                                    </p>
                                </div>
                            </div>
                            
                            <p className="text-base">
                                <span className="font-semibold">CPF: </span>
                                {formatCPF(formData.cpf)}
                            </p>
                            
                            <div>
                                <p className="text-base font-semibold mb-2">Assinatura:</p>
                                {formData.signature && (
                                    <img 
                                        src={formData.signature.full} 
                                        alt="Assinatura"
                                        className="max-w-[500px] max-h-[120px] object-contain"
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div 
                    ref={contentRef} 
                    className="fixed -left-[99999px] top-0 bg-white"
                    style={{
                        width: "794px",
                        minHeight: "1123px",
                        padding: "40px",
                    }}
                >
                    <Documents />
                    
                    {/* Dados do formulário incorporados ao documento */}
                    <div className="mt-4 border-t pt-4">
                        <div className="space-y-2">
                            <div className="grid grid-cols-3 gap-4">
                                <div className="col-span-2">
                                    <p className="text-base">
                                        <span className="font-semibold">Nome: </span>
                                        {formData.name}
                                    </p>
                                </div>
                                <div className="flex-1">
                                    <p className="text-base">
                                        <span className="font-semibold">Data: </span>
                                        {new Date(formData.date).toLocaleDateString('pt-BR')}
                                    </p>
                                </div>
                            </div>
                            
                            <p className="text-base">
                                <span className="font-semibold">CPF: </span>
                                {formatCPF(formData.cpf)}
                            </p>
                            
                            <div>
                                <p className="text-base font-semibold mb-2">Assinatura:</p>
                                {formData.signature && (
                                    <img 
                                        src={formData.signature.full} 
                                        alt="Assinatura"
                                        className="max-w-[500px] max-h-[120px] object-contain"
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Formulário de entrada - NÃO será incluído no PDF */}
                <div className="bg-white shadow-lg rounded-lg p-8 max-w-[210mm] mx-auto">
                    <h2 className="text-2xl font-bold mb-6 text-gray-800">
                        Preencha seus dados
                    </h2>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold mb-1">
                                Nome Completo
                            </label>
                            <input 
                                type="text" 
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="Digite seu nome completo"
                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                            />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold mb-1">
                                    CPF
                                </label>
                                <input 
                                    type="text" 
                                    name="cpf"
                                    value={formData.cpf}
                                    onChange={handleInputChange}
                                    placeholder="000.000.000-00"
                                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold mb-1">
                                    Data
                                </label>
                                <input 
                                    type="date" 
                                    name="date"
                                    value={formData.date}
                                    onChange={handleInputChange}
                                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                />
                            </div>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-semibold mb-1">
                                Assinatura
                            </label>
                            <SignaturePad onSave={handleSignatureSave} />
                        </div>
                        
                        <div className="flex justify-center pt-4">
                            <button
                                type="button"
                                onClick={generatePDF}
                                className="px-8 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center gap-2 text-lg font-semibold shadow-md hover:shadow-lg"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" />
                                </svg>
                                GERAR PDF
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}