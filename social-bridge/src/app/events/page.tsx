import EventsPublicList from "@/components/events/EventsPublicList";
import WrapperMaxWidth from "@/components/shared/WrapperMaxWidth";
import ShowOnMapButton from "@/components/map/event/ShowOnMapButton";

export default function EventsPage() {
  return (
    <WrapperMaxWidth className="flex flex-col gap-2 pb-12">
      <div className="mt-2 flex items-center justify-end">
        <ShowOnMapButton />
      </div>
      <EventsPublicList future={true} />
    </WrapperMaxWidth>
  );
}
