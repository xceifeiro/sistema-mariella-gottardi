// components/ToastAlerta.tsx
'use client';

import { useEffect } from 'react';
import { toast } from 'react-toastify';

type ToastAlertaProps = {
  mensagem: string;
  tipo?: 'success' | 'error' | 'info' | 'warning';
};

export default function ToastAlerta({ mensagem, tipo = 'info' }: ToastAlertaProps) {
  useEffect(() => {
    toast[mensagem ? tipo : 'info'](mensagem);
  }, [mensagem, tipo]);

  return null; // Não renderiza nada visualmente, apenas o toast
}
