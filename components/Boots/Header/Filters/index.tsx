'use client';
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '@/components/ui/combobox';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import clsx from 'clsx';

const frameworks = [
  'Next.js',
  'SvelteKit',
  'Nuxt.js',
  'Remix',
  'Astro',
] as const;

export default function BootsFilters() {
  return (
    <div
      className={clsx(
        'w-full border-foreground/20 flex min-h-11 max-h-12 border-2 rounded-lg'
      )}
    >
      <Combobox items={frameworks}>
        <ComboboxInput
          placeholder="Seleccione un modelo"
          className={clsx('h-full rounded-r-none border-none w-1/5')}
        />
        <ComboboxContent>
          <ComboboxEmpty>No items found.</ComboboxEmpty>
          <ComboboxList>
            {(item) => (
              <ComboboxItem key={item} value={item}>
                {item}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
      <div className={clsx('w-0.5 h-full bg-foreground/20')} />
      <Select>
        <SelectTrigger className="max-w-64 rounded-none w-full" size="full">
          <SelectValue placeholder="Seleccione una talla" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Fruits</SelectLabel>
            <SelectItem value="apple">Apple</SelectItem>
            <SelectItem value="banana">Banana</SelectItem>
            <SelectItem value="blueberry">Blueberry</SelectItem>
            <SelectItem value="grapes">Grapes</SelectItem>
            <SelectItem value="pineapple">Pineapple</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <div className={clsx('w-0.5 h-full bg-foreground/20')} />
      <Select>
        <SelectTrigger className="w-full max-w-64 rounded-none" size="full">
          <SelectValue placeholder="Seleccione un " />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Fruits</SelectLabel>
            <SelectItem value="apple">Apple</SelectItem>
            <SelectItem value="banana">Banana</SelectItem>
            <SelectItem value="blueberry">Blueberry</SelectItem>
            <SelectItem value="grapes">Grapes</SelectItem>
            <SelectItem value="pineapple">Pineapple</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <div className={clsx('w-0.5 h-full bg-foreground/20')} />
    </div>
  );
}
