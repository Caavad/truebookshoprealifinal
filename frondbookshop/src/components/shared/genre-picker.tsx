"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CategoryDto } from "@/helpers/interfaces/categories";
import { categoriesApi } from "@/lib/api";
import { withFallbackCategories } from "@/lib/categories";

const selectClassName =
  "h-10 rounded-md border border-zinc-700 bg-zinc-950 px-3";

type GenrePickerProps = {
  token?: string;
  category: string;
  subCategory: string;
  categories: CategoryDto[];
  onCategoriesChange: (categories: CategoryDto[]) => void;
  onChange: (category: string, subCategory: string) => void;
};

export function GenrePicker({
  token,
  category,
  subCategory,
  categories,
  onCategoriesChange,
  onChange,
}: GenrePickerProps) {
  const catalog = withFallbackCategories(categories);
  const selected = catalog.find(
    (item) => item.name.toLowerCase() === category.toLowerCase()
  );
  const subOptions = selected?.subCategories ?? [];
  const hasCurrentCategory = catalog.some(
    (item) => item.name.toLowerCase() === category.toLowerCase()
  );
  const hasCurrentSubgenre = subOptions.some(
    (item) => item.name.toLowerCase() === subCategory.toLowerCase()
  );

  const [addingGenre, setAddingGenre] = useState(false);
  const [addingSubgenre, setAddingSubgenre] = useState(false);
  const [newGenreName, setNewGenreName] = useState("");
  const [newGenreDescription, setNewGenreDescription] = useState("");
  const [newSubName, setNewSubName] = useState("");
  const [newSubDescription, setNewSubDescription] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function addGenre() {
    const name = newGenreName.trim();
    if (!name || !token) return;

    setBusy(true);
    setError("");
    try {
      const created = await categoriesApi.create(token, {
        name,
        description: newGenreDescription.trim() || undefined,
      });
      const next = await categoriesApi.getAll();
      onCategoriesChange(next.length > 0 ? next : [created]);
      onChange(created.name, created.subCategories[0]?.name ?? "");
      setNewGenreName("");
      setNewGenreDescription("");
      setAddingGenre(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add genre");
    } finally {
      setBusy(false);
    }
  }

  async function addSubgenre() {
    const name = newSubName.trim();
    if (!name || !token || !selected || selected.id < 0) return;

    setBusy(true);
    setError("");
    try {
      const created = await categoriesApi.createSub(token, selected.id, {
        name,
        description: newSubDescription.trim() || undefined,
      });
      const next = await categoriesApi.getAll();
      onCategoriesChange(next);
      onChange(category, created.name);
      setNewSubName("");
      setNewSubDescription("");
      setAddingSubgenre(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add subgenre");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-3">
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label>Genre</Label>
          <select
            className={selectClassName}
            value={category}
            onChange={(e) => {
              const nextCategory = e.target.value;
              const next = catalog.find((item) => item.name === nextCategory);
              onChange(nextCategory, next?.subCategories[0]?.name ?? "");
            }}
          >
            {catalog.map((item) => (
              <option key={item.id} value={item.name}>
                {item.displayName || item.name}
              </option>
            ))}
            {!hasCurrentCategory && category && (
              <option value={category}>{category}</option>
            )}
          </select>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-7 justify-start px-1 text-zinc-400"
            onClick={() => setAddingGenre((prev) => !prev)}
          >
            {addingGenre ? "Cancel new genre" : "+ Add new genre"}
          </Button>
        </div>
        <div className="grid gap-2">
          <Label>Subgenre</Label>
          <select
            className={selectClassName}
            value={subCategory}
            onChange={(e) => onChange(category, e.target.value)}
          >
            {subOptions.length === 0 && (
              <option value="">No subgenres yet</option>
            )}
            {subOptions.map((item) => (
              <option key={item.id} value={item.name}>
                {item.displayName || item.name}
              </option>
            ))}
            {subCategory && !hasCurrentSubgenre && (
              <option value={subCategory}>{subCategory}</option>
            )}
          </select>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-7 justify-start px-1 text-zinc-400"
            disabled={!selected || selected.id < 0}
            onClick={() => setAddingSubgenre((prev) => !prev)}
          >
            {addingSubgenre ? "Cancel new subgenre" : "+ Add new subgenre"}
          </Button>
        </div>
      </div>

      {addingGenre && (
        <div className="rounded-md border border-zinc-800 bg-zinc-950 p-3 space-y-2">
          <Label>New genre name</Label>
          <Input
            placeholder="Romance"
            value={newGenreName}
            onChange={(e) => setNewGenreName(e.target.value)}
          />
          <Input
            placeholder="Optional description"
            value={newGenreDescription}
            onChange={(e) => setNewGenreDescription(e.target.value)}
          />
          <Button type="button" size="sm" disabled={busy || !newGenreName.trim()} onClick={addGenre}>
            Save genre
          </Button>
        </div>
      )}

      {addingSubgenre && (
        <div className="rounded-md border border-zinc-800 bg-zinc-950 p-3 space-y-2">
          <Label>New subgenre name</Label>
          <Input
            placeholder="Contemporary"
            value={newSubName}
            onChange={(e) => setNewSubName(e.target.value)}
          />
          <Input
            placeholder="Optional description"
            value={newSubDescription}
            onChange={(e) => setNewSubDescription(e.target.value)}
          />
          <Button type="button" size="sm" disabled={busy || !newSubName.trim()} onClick={addSubgenre}>
            Save subgenre
          </Button>
        </div>
      )}

      {error && <p className="text-sm text-red-300">{error}</p>}
    </div>
  );
}
