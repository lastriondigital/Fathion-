/**
 * FAITHION — Bible Repository
 * Gerencia as tabelas 'favorites', 'notes', 'bible_versions' e 'word_of_day_history' no Supabase.
 */

import { supabase } from '../../lib/supabase';
import { BibleFavorite, BibleNote } from '../../types';
import { FaithionStorageService } from '../storage';
import { getCurrentAuthenticatedUserId, parseSupabaseError, RepoResult } from './repoUtils';

export class BibleRepository {
  /**
   * Favoritos bíblicos
   */
  static async getFavorites(): Promise<RepoResult<BibleFavorite[]>> {
    const local = FaithionStorageService.getBibleFavorites();
    const userId = await getCurrentAuthenticatedUserId();

    if (!userId || !supabase) {
      return { data: local, error: null, isFromLocal: true };
    }

    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        const parsed = parseSupabaseError(error, 'Erro ao buscar versículos favoritos.');
        return { data: local, error: parsed.message, errorCode: parsed.code, isFromLocal: true };
      }

      if (data && data.length > 0) {
        const mapped: BibleFavorite[] = data.map(r => ({
          id: r.id,
          bookId: r.book_id,
          bookName: r.book_name,
          chapter: r.chapter,
          verseNumber: r.verse_number,
          verseText: r.verse_text,
          versionId: r.version_id,
          createdAt: r.created_at
        }));

        FaithionStorageService.saveBibleFavorites(mapped);
        return { data: mapped, error: null, isFromLocal: false };
      }

      return { data: local, error: null, isFromLocal: true };
    } catch (err: any) {
      const parsed = parseSupabaseError(err, 'Falha ao buscar favoritos.');
      return { data: local, error: parsed.message, errorCode: parsed.code, isFromLocal: true };
    }
  }

  static async addFavorite(fav: BibleFavorite): Promise<RepoResult<BibleFavorite>> {
    FaithionStorageService.addBibleFavorite(fav);
    const userId = await getCurrentAuthenticatedUserId();

    if (!userId || !supabase) {
      return { data: fav, error: null, isFromLocal: true };
    }

    try {
      const { error } = await supabase
        .from('favorites')
        .upsert({
          id: fav.id,
          user_id: userId,
          book_id: fav.bookId,
          book_name: fav.bookName,
          chapter: fav.chapter,
          verse_number: fav.verseNumber,
          verse_text: fav.verseText,
          version_id: fav.versionId,
          created_at: fav.createdAt
        });

      if (error) {
        const parsed = parseSupabaseError(error, 'Erro ao sincronizar favorito com o Supabase.');
        return { data: fav, error: parsed.message, errorCode: parsed.code, isFromLocal: true };
      }

      return { data: fav, error: null, isFromLocal: false };
    } catch (err: any) {
      const parsed = parseSupabaseError(err, 'Falha ao adicionar favorito.');
      return { data: fav, error: parsed.message, errorCode: parsed.code, isFromLocal: true };
    }
  }

  static async removeFavorite(id: string): Promise<RepoResult<boolean>> {
    FaithionStorageService.removeBibleFavorite(id);
    const userId = await getCurrentAuthenticatedUserId();

    if (!userId || !supabase) {
      return { data: true, error: null, isFromLocal: true };
    }

    try {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

      if (error) {
        const parsed = parseSupabaseError(error, 'Erro ao remover favorito no Supabase.');
        return { data: false, error: parsed.message, errorCode: parsed.code, isFromLocal: true };
      }

      return { data: true, error: null, isFromLocal: false };
    } catch (err: any) {
      const parsed = parseSupabaseError(err, 'Falha ao remover favorito.');
      return { data: false, error: parsed.message, errorCode: parsed.code, isFromLocal: true };
    }
  }

  /**
   * Notas e anotações bíblicas
   */
  static async getNotes(): Promise<RepoResult<BibleNote[]>> {
    const local = FaithionStorageService.getBibleNotes();
    const userId = await getCurrentAuthenticatedUserId();

    if (!userId || !supabase) {
      return { data: local, error: null, isFromLocal: true };
    }

    try {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false });

      if (error) {
        const parsed = parseSupabaseError(error, 'Erro ao carregar anotações bíblicas.');
        return { data: local, error: parsed.message, errorCode: parsed.code, isFromLocal: true };
      }

      if (data && data.length > 0) {
        const mapped: BibleNote[] = data.map(r => ({
          id: r.id,
          bookId: r.book_id,
          bookName: r.book_name,
          chapter: r.chapter,
          verseNumber: r.verse_number ?? undefined,
          noteText: r.note_text,
          versionId: r.version_id,
          createdAt: r.created_at,
          updatedAt: r.updated_at || r.created_at
        }));

        FaithionStorageService.saveBibleNotes(mapped);
        return { data: mapped, error: null, isFromLocal: false };
      }

      return { data: local, error: null, isFromLocal: true };
    } catch (err: any) {
      const parsed = parseSupabaseError(err, 'Falha ao buscar anotações.');
      return { data: local, error: parsed.message, errorCode: parsed.code, isFromLocal: true };
    }
  }

  static async saveNote(note: BibleNote): Promise<RepoResult<BibleNote>> {
    FaithionStorageService.saveBibleNote(note);
    const userId = await getCurrentAuthenticatedUserId();

    if (!userId || !supabase) {
      return { data: note, error: null, isFromLocal: true };
    }

    try {
      const { error } = await supabase
        .from('notes')
        .upsert({
          id: note.id,
          user_id: userId,
          book_id: note.bookId,
          book_name: note.bookName,
          chapter: note.chapter,
          verse_number: note.verseNumber ?? null,
          note_text: note.noteText,
          version_id: note.versionId,
          created_at: note.createdAt,
          updated_at: note.updatedAt
        });

      if (error) {
        const parsed = parseSupabaseError(error, 'Erro ao salvar anotação no Supabase.');
        return { data: note, error: parsed.message, errorCode: parsed.code, isFromLocal: true };
      }

      return { data: note, error: null, isFromLocal: false };
    } catch (err: any) {
      const parsed = parseSupabaseError(err, 'Falha ao salvar anotação.');
      return { data: note, error: parsed.message, errorCode: parsed.code, isFromLocal: true };
    }
  }
}
