'use client';

import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { Area, getCroppedImg } from '@/lib/cropImage';
import { ZoomIn, ZoomOut, Check, X, RotateCcw } from 'lucide-react';

interface ImageCropModalProps {
  imageSrc: string;
  isOpen: boolean;
  onClose: () => void;
  onCropComplete: (croppedBlob: Blob, croppedUrl: string) => void;
}

export function ImageCropModal({
  imageSrc,
  isOpen,
  onClose,
  onCropComplete,
}: ImageCropModalProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const onCropChange = (newCrop: { x: number; y: number }) => {
    setCrop(newCrop);
  };

  const onCropAreaComplete = useCallback(
    (_croppedArea: Area, currentCroppedAreaPixels: Area) => {
      setCroppedAreaPixels(currentCroppedAreaPixels);
    },
    []
  );

  const handleConfirm = async () => {
    if (!croppedAreaPixels) return;

    try {
      setIsProcessing(true);
      const { blob, url } = await getCroppedImg(imageSrc, croppedAreaPixels, 600);
      onCropComplete(blob, url);
      onClose();
    } catch (error) {
      console.error('Erro ao recortar imagem:', error);
      alert('Houve um erro ao processar a imagem. Tente novamente.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Ajustar Foto do Paciente</h3>
            <p className="text-xs text-slate-500">
              Arraste e ajuste o zoom para enquadrar o rosto perfeitamente
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Área do Cropper */}
        <div className="relative w-full h-80 bg-slate-900 overflow-hidden">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="round"
            showGrid={true}
            onCropChange={onCropChange}
            onCropComplete={onCropAreaComplete}
            onZoomChange={setZoom}
          />
        </div>

        {/* Controles de Zoom e Ações */}
        <div className="p-6 bg-slate-50 flex flex-col gap-5">
          <div className="flex items-center gap-3">
            <ZoomOut className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="range"
              value={zoom}
              min={1}
              max={3}
              step={0.05}
              aria-label="Zoom"
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-red-600"
            />
            <ZoomIn className="w-4 h-4 text-slate-400 shrink-0" />
            <button
              type="button"
              onClick={() => {
                setZoom(1);
                setCrop({ x: 0, y: 0 });
              }}
              title="Resetar ajuste"
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/60 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-white transition-colors"
              disabled={isProcessing}
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={isProcessing}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-bold shadow-lg shadow-red-200 transition-all disabled:opacity-50"
            >
              {isProcessing ? (
                <span>Salvando...</span>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Confirmar Enquadramento</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
