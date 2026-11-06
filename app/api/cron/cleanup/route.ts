import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

export async function GET(request: NextRequest) {
  return handleCleanup(request);
}

export async function POST(request: NextRequest) {
  return handleCleanup(request);
}

async function handleCleanup(request: NextRequest) {
  try {
    // 1. Validação de segurança opcional via CRON_SECRET (recomendado para Vercel Cron ou serviços externos)
    const cronSecret = process.env.CRON_SECRET;
    if (cronSecret) {
      const authHeader = request.headers.get('authorization');
      if (authHeader !== `Bearer ${cronSecret}`) {
        return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
      }
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    // Utiliza service role key caso exista, senão anon key
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        { error: 'Credenciais do Supabase não configuradas no servidor' },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const thirtyDaysAgo = new Date(Date.now() - THIRTY_DAYS_MS).toISOString();

    // 2. Tentar executar via RPC segura no PostgreSQL (passando 30 dias)
    let rpcResult: any = null;
    let rpcError: any = null;

    const rpcResWithParam = await supabase.rpc('cleanup_expired_campaigns', { days_threshold: 30 });
    if (!rpcResWithParam.error) {
      rpcResult = rpcResWithParam.data;
    } else {
      // Tenta sem parâmetro caso a função não tenha sido atualizada com assinatura days_threshold
      const rpcResDefault = await supabase.rpc('cleanup_expired_campaigns');
      if (!rpcResDefault.error) {
        rpcResult = rpcResDefault.data;
      } else {
        rpcError = rpcResDefault.error;
      }
    }

    if (rpcResult) {
      const deletedCount = rpcResult.deleted_count ?? 0;
      const photoUrls: string[] = rpcResult.photos ?? [];

      // Remove arquivos físicos do Supabase Storage
      const removedFiles = await deletePhotosFromStorage(supabase, photoUrls);

      return NextResponse.json({
        success: true,
        method: 'rpc',
        deleted_count: deletedCount,
        photos_removed_from_storage: removedFiles.length,
        message: `Limpeza concluída com sucesso. ${deletedCount} cadastros e ${removedFiles.length} fotos removidas.`,
      });
    }

    // 3. Fallback: Caso a RPC ainda não tenha sido criada no banco
    // Busca as campanhas expiradas
    const { data: expiredCampaigns, error: fetchError } = await supabase
      .from('campaigns')
      .select('id, patient_photo_url')
      .lt('created_at', thirtyDaysAgo);

    if (fetchError) {
      return NextResponse.json(
        { error: `Erro ao buscar campanhas expiradas: ${fetchError.message}` },
        { status: 500 }
      );
    }

    if (!expiredCampaigns || expiredCampaigns.length === 0) {
      return NextResponse.json({
        success: true,
        deleted_count: 0,
        message: 'Nenhum cadastro com mais de 30 dias para remover.',
      });
    }

    const photoUrls = expiredCampaigns
      .map((c) => c.patient_photo_url)
      .filter((url): url is string => Boolean(url));

    // Remove as fotos do bucket
    const removedFiles = await deletePhotosFromStorage(supabase, photoUrls);

    // Deleta os registros da tabela campaigns
    const expiredIds = expiredCampaigns.map((c) => c.id);
    const { data: deletedData, error: deleteError } = await supabase
      .from('campaigns')
      .delete()
      .in('id', expiredIds)
      .select('id');

    if (deleteError) {
      return NextResponse.json(
        {
          error: `Erro ao excluir registros da tabela (verifique se a RPC cleanup_expired_campaigns foi criada ou configure SUPABASE_SERVICE_ROLE_KEY): ${deleteError.message}`,
        },
        { status: 500 }
      );
    }

    const deletedCount = deletedData ? deletedData.length : expiredCampaigns.length;

    return NextResponse.json({
      success: true,
      method: 'direct_delete',
      deleted_count: deletedCount,
      photos_removed_from_storage: removedFiles.length,
      message: `Limpeza realizada. ${deletedCount} cadastros removidos.`,
    });
  } catch (error: any) {
    console.error('Erro na rotina de cleanup:', error);
    return NextResponse.json(
      { error: error?.message || 'Erro interno no servidor' },
      { status: 500 }
    );
  }
}

async function deletePhotosFromStorage(supabase: any, photoUrls: string[]): Promise<string[]> {
  if (!photoUrls || photoUrls.length === 0) return [];

  const fileNamesToDelete: string[] = [];
  for (const url of photoUrls) {
    try {
      // Formato típico: .../storage/v1/object/public/campaigns/nome-do-arquivo.jpg
      const parts = url.split('/campaigns/');
      if (parts.length > 1) {
        fileNamesToDelete.push(parts[1]);
      }
    } catch {
      // Ignora URLs com formato inesperado
    }
  }

  if (fileNamesToDelete.length === 0) return [];

  try {
    const { data, error } = await supabase.storage
      .from('campaigns')
      .remove(fileNamesToDelete);

    if (error) {
      console.error('Erro ao deletar fotos do Storage:', error);
      return [];
    }
    return data ? data.map((d: any) => d.name) : fileNamesToDelete;
  } catch (err) {
    console.error('Exceção ao deletar fotos do Storage:', err);
    return [];
  }
}

