const encoder = new TextEncoder();

export function zipStore(files: [string, string][]) {
  const parts: Uint8Array[] = [];
  const entries: { name: Uint8Array; crc: number; size: number; offset: number }[] = [];
  let offset = 0;
  for (const [name, text] of files) {
    const data = encoder.encode(text);
    const named = encoder.encode(name);
    const crc = crc32(data);
    const local = header(false, named, crc, data.length, 0);
    parts.push(local, data);
    entries.push({ name: named, crc, size: data.length, offset });
    offset += local.length + data.length;
  }
  const centralAt = offset;
  for (const entry of entries) {
    const part = header(true, entry.name, entry.crc, entry.size, entry.offset);
    parts.push(part);
    offset += part.length;
  }
  parts.push(endHeader(entries.length, offset - centralAt, centralAt));
  return concat(parts);
}

function header(central: boolean, name: Uint8Array, crc: number, size: number, start: number) {
  const bytes = new Uint8Array((central ? 46 : 30) + name.length);
  const view = new DataView(bytes.buffer);
  view.setUint32(0, central ? 0x02014b50 : 0x04034b50, true);
  view.setUint16(4, 20, true);
  if (central) view.setUint16(6, 20, true);
  const at = central ? 16 : 14;
  view.setUint32(at, crc, true);
  view.setUint32(at + 4, size, true);
  view.setUint32(at + 8, size, true);
  view.setUint16(at + 12, name.length, true);
  if (central) view.setUint32(42, start, true);
  bytes.set(name, central ? 46 : 30);
  return bytes;
}

function endHeader(count: number, size: number, offset: number) {
  const bytes = new Uint8Array(22);
  const view = new DataView(bytes.buffer);
  view.setUint32(0, 0x06054b50, true);
  view.setUint16(8, count, true);
  view.setUint16(10, count, true);
  view.setUint32(12, size, true);
  view.setUint32(16, offset, true);
  return bytes;
}

function concat(parts: Uint8Array[]) {
  const out = new Uint8Array(parts.reduce((sum, part) => sum + part.length, 0));
  let offset = 0;
  for (const part of parts) {
    out.set(part, offset);
    offset += part.length;
  }
  return out;
}

function crc32(data: Uint8Array) {
  let crc = -1;
  for (const byte of data) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit += 1) crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
  }
  return (crc ^ -1) >>> 0;
}
