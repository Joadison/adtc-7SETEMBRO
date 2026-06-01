'use client';

import { useRef, useState, useEffect, MouseEvent, TouchEvent } from 'react';

interface SignatureData {
    full: string;
    preview: string;
}

interface SignaturePadProps {
    onSave?: (signatureData: SignatureData) => void;
}

interface Coordinates {
    offsetX: number;
    offsetY: number;
}


const SignaturePad = ({ onSave }: SignaturePadProps) => {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [signature, setSignature] = useState<SignatureData | null>(null);
    const modalCanvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState<boolean>(false);
    const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);

    const drawBaseline = (context: CanvasRenderingContext2D, width: number, height: number): void => {
        context.clearRect(0, 0, width, height);
        context.fillStyle = '#fff';
        context.fillRect(0, 0, width, height);
        const baselineY = height * 0.7;
        context.beginPath();
        context.strokeStyle = '#9ca3af';
        context.lineWidth = 1.5;
        context.setLineDash([10, 5]);
        context.moveTo(30, baselineY);
        context.lineTo(width - 30, baselineY);
        context.stroke();
        context.font = '12px sans-serif';
        context.fillStyle = '#6b7280';
        context.fillText('Assine aqui', 40, baselineY - 10);
        context.setLineDash([]);
        context.strokeStyle = '#000';
    };

    useEffect(() => {
        if (isModalOpen && modalCanvasRef.current) {
            const canvas = modalCanvasRef.current;
            const context = canvas.getContext('2d');

            if (!context) return;
            
            const resizeCanvas = () => {
                const container = canvas.parentElement;
                if (!container) return;

                canvas.width = container.clientWidth - 40;
                canvas.height = window.innerHeight * 0.6;
                
                drawBaseline(context, canvas.width, canvas.height);
                
                context.strokeStyle = '#000';
                context.lineWidth = 2;
                context.lineCap = 'round';
                context.lineJoin = 'round';
            };
            
            resizeCanvas();
            window.addEventListener('resize', resizeCanvas);
            
            context.strokeStyle = '#000';
            context.lineWidth = 2;
            context.lineCap = 'round';
            context.lineJoin = 'round';
            
            setCtx(context);
            
            return () => window.removeEventListener('resize', resizeCanvas);
        }
    }, [isModalOpen]);

    const clearSignature = () => {
        if (!ctx || !modalCanvasRef.current) return;
        drawBaseline(ctx, modalCanvasRef.current.width, modalCanvasRef.current.height);
    };

   const getCoordinates = (e: MouseEvent<HTMLCanvasElement> | TouchEvent<HTMLCanvasElement>, canvas: HTMLCanvasElement): Coordinates => {
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        
        let clientX: number, clientY: number;
        
        if ('touches' in e) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = e.clientX;
            clientY = e.clientY;
        }
        
        let offsetX = (clientX - rect.left) * scaleX;
        let offsetY = (clientY - rect.top) * scaleY;
        
        offsetX = Math.max(0, Math.min(canvas.width, offsetX));
        offsetY = Math.max(0, Math.min(canvas.height, offsetY));

        return { offsetX, offsetY };
    };

    const startDrawing = (e: MouseEvent<HTMLCanvasElement> | TouchEvent<HTMLCanvasElement>): void => {
        e.preventDefault();
        if (!ctx || !modalCanvasRef.current) return;
        setIsDrawing(true);
        const { offsetX, offsetY } = getCoordinates(e, modalCanvasRef.current);
        ctx.beginPath();
        ctx.moveTo(offsetX, offsetY);
    };

    const draw = (e: MouseEvent<HTMLCanvasElement> | TouchEvent<HTMLCanvasElement>): void => {
        e.preventDefault();
        if (!isDrawing || !ctx || !modalCanvasRef.current) return;
        const { offsetX, offsetY } = getCoordinates(e, modalCanvasRef.current);
        ctx.lineTo(offsetX, offsetY);
        ctx.stroke();
    };

    const stopDrawing = () => {
        if (!ctx) return;
        setIsDrawing(false);
        ctx.closePath();
    };

    const saveSignature = () => {
        if (!modalCanvasRef.current) return;
        
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = modalCanvasRef.current.width;
        tempCanvas.height = modalCanvasRef.current.height;
        const tempCtx = tempCanvas.getContext('2d');

        if (!tempCtx) return;
        tempCtx.drawImage(modalCanvasRef.current, 0, 0);
        
        const previewCanvas = document.createElement('canvas');
        previewCanvas.width = 200;
        previewCanvas.height = 100;
        const previewCtx = previewCanvas.getContext('2d');

        if (!previewCtx) return;
        previewCtx.drawImage(modalCanvasRef.current, 0, 0, 200, 100);
        
        const signatureData = {
            full: tempCanvas.toDataURL('image/png'),
            preview: previewCanvas.toDataURL('image/png')
        };
        
        setSignature(signatureData);
        
        if (onSave) {
            onSave(signatureData);
        }
        setIsModalOpen(false);
    };

    return (
        <>
            <div className="mb-5">
                {signature ? (
                    <div className="space-y-2">
                        <div className="border-2 border-gray-300 rounded-md p-2 bg-gray-50 inline-block">
                            <img 
                                src={signature.preview} 
                                alt="Signature preview" 
                                className="h-20 w-auto"
                            />
                        </div>
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(true)}
                                className="px-4 py-2 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600 transition-colors"
                            >
                                Editar Assinatura
                            </button>
                            <button
                                type="button"
                                onClick={() => setSignature(null)}
                                className="px-4 py-2 bg-gray-500 text-white rounded-md text-sm hover:bg-gray-600 transition-colors"
                            >
                                Remover
                            </button>
                        </div>
                    </div>
                ) : (
                    <button
                        type="button"
                        onClick={() => setIsModalOpen(true)}
                        className="px-6 py-3 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600 transition-colors flex items-center gap-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd" />
                        </svg>
                        Adicionar Assinatura
                    </button>
                )}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg w-full max-w-4xl mx-auto shadow-xl">
                        <div className="flex items-center justify-between p-4 border-b">
                            <h2 className="text-xl font-semibold text-gray-800">Assinatura Digital</h2>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-gray-500 hover:text-gray-700 transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="p-4">
                            <div className="bg-gray-50 rounded-lg p-4">
                                <div className="relative w-full touch-none cursor-crosshair">
                                    <canvas
                                        ref={modalCanvasRef}
                                        onMouseDown={startDrawing}
                                        onMouseMove={draw}
                                        onMouseUp={stopDrawing}
                                        onMouseLeave={stopDrawing}
                                        onTouchStart={startDrawing}
                                        onTouchMove={draw}
                                        onTouchEnd={stopDrawing}
                                        className="w-full h-auto bg-white rounded-lg shadow-inner border-2 border-gray-300"
                                        style={{ minHeight: '300px' }}
                                    />
                                </div>
                                <p className="text-sm text-gray-500 mt-2 text-center">
                                    Assine sobre ou acima da linha tracejada usando o mouse ou o dedo.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center justify-between p-4 border-t bg-gray-50 rounded-b-lg">
                            <button
                                type="button"
                                onClick={clearSignature}
                                className="px-4 py-2 bg-red-500 text-white rounded-md text-sm hover:bg-red-600 transition-colors flex items-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Limpar
                            </button>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 bg-gray-500 text-white rounded-md text-sm hover:bg-gray-600 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="button"
                                    onClick={saveSignature}
                                    className="px-4 py-2 bg-green-500 text-white rounded-md text-sm hover:bg-green-600 transition-colors flex items-center gap-2"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Salvar Assinatura
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default SignaturePad;