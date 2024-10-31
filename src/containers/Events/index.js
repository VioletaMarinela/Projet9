import { useState } from "react";
import EventCard from "../../components/EventCard";
import Select from "../../components/Select";
import { useData } from "../../contexts/DataContext";
import Modal from "../Modal";
import ModalEvent from "../ModalEvent";
import "./style.css";

const PER_PAGE = 9;

const EventList = () => {
  const { data, error } = useData();
  const [type, setType] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredEvents = (data?.events || [])
    .filter(event => (type ? event.type === type : true))
    .filter((event, index) => (currentPage - 1) * PER_PAGE <= index && PER_PAGE * currentPage > index);

  const changeType = (evtType) => {
    setCurrentPage(1);
    setType(evtType || null);
  };

  const pageNumber = Math.ceil((data?.events.length || 0) / PER_PAGE);
  const typeList = new Set(data?.events.map(event => event.type));

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <>
      {error && <div>An error occurred</div>}
      {data === null ? (
        "Loading"
      ) : (
        <>
          <h3 className="SelectTitle">Catégories</h3>
          <Select
            selection={Array.from(typeList)}
            onChange={(value) => changeType(value || null)}
          />
          <div id="events" className="ListContainer">
            {filteredEvents.map((event) => (
              <Modal key={event.id} Content={<ModalEvent event={event} />}>
                {({ setIsOpened }) => (
                  <EventCard
                    onClick={() => setIsOpened(true)}
                    imageSrc={event.cover}
                    title={event.title}
                    date={new Date(event.date)}
                    label={event.type}
                  />
                )}
              </Modal>
            ))}
          </div>
          <div className="Pagination">
            {[...Array(pageNumber)].map((_, n) => (
              <a key={`page-${n + 1}`} href="#events" onClick={() => handlePageChange(n + 1)}
                className={currentPage === n + 1 ? "active" : ""}
              >
                {n + 1}
              </a>
            ))}
          </div>
        </>
      )}
    </>
  );
};

export default EventList;
