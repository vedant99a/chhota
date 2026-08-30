import { STATUS_DOT, STATUS_LABEL } from '../lib/orderStatus';

// design.md: a 7px filled dot plus a word. Nothing else.
export default function StatusIndicator({ status }) {
  return (
    <span className="flex items-center gap-2">
      <span className={`h-[7px] w-[7px] rounded-full ${STATUS_DOT[status] || 'bg-muted'}`} />
      <span className="text-body">{STATUS_LABEL[status] || status}</span>
    </span>
  );
}
