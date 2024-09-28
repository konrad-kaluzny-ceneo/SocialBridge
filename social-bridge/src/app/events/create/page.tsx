import EventCreateForm from "@/components/events/EventCreateForm";
import WrapperMaxWidth from "@/components/shared/WrapperMaxWidth";

export default function EventsCreatePage() {
  return (
    <WrapperMaxWidth>
      <h1 className="mh">Utwórz wydarzenie</h1>
      <EventCreateForm />
    </WrapperMaxWidth>
  );
}
