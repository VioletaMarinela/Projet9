import { fireEvent, render, screen } from "@testing-library/react";
import { api, DataProvider } from "../../contexts/DataContext";
import Events from "./index";

const data = {
  events: [
    {
      id: 1,
      type: "soirée entreprise",
      date: "2022-04-29T20:28:45.744Z",
      title: "Conférence #productCON",
      cover: "/images/stem-list-EVgsAbL51Rk-unsplash.png",
      description:
        "Présentation des outils analytics aux professionnels du secteur",
      nb_guesses: 1300,
      periode: "24-25-26 Février",
      prestations: [
        "1 espace d’exposition",
        "1 scène principale",
        "2 espaces de restauration",
        "1 site web dédié",
      ],
    },
    {
      id: 2,
      type: "forum",
      date: "2022-04-29T20:28:45.744Z",
      title: "Forum #productCON",
      cover: "/images/stem-list-EVgsAbL51Rk-unsplash.png",
      description:
        "Présentation des outils analytics aux professionnels du secteur",
      nb_guesses: 1300,
      periode: "24-25-26 Février",
      prestations: ["1 espace d’exposition", "1 scène principale"],
    },
  ],
};

describe("When Events is created", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear any previous mocks before each test  
  });

  it("a list of event cards is displayed", async () => {
    api.loadData = jest.fn().mockResolvedValue(data); // Ensure the promise resolves  
    render(
      <DataProvider>
        <Events />
      </DataProvider>
    );

    // Change this line to findAllByText  
    const months = await screen.findAllByText("avril");
    expect(months.length).toBeGreaterThan(0); // Ensure there's at least one occurrence of "avril"  

    expect(screen.getByText("Conférence #productCON")).toBeInTheDocument();
    expect(screen.getByText("Forum #productCON")).toBeInTheDocument();
  });

  describe("and an error occurred", () => {
    it("an error message is displayed", async () => {
      api.loadData = jest.fn().mockRejectedValue(new Error("Failed to load")); // Provide a proper error object  
      render(
        <DataProvider>
          <Events />
        </DataProvider>
      );
      expect(await screen.findByText("An error occurred")).toBeInTheDocument();
      // Ensure the text matches your component's error message  
    });
  });

  describe("and we select a category", () => {
    it("a filtered list is displayed", async () => {
      api.loadData = jest.fn().mockResolvedValue(data);
      render(
        <DataProvider>
          <Events />
        </DataProvider>
      );

      await screen.findByText("Forum #productCON");

      // Simulate clicking on the collapse button  
      fireEvent.click(await screen.findByTestId("collapse-button-testid"));

      // Simulate filtering action (clicking the event card)  
      const firstEventCard = await screen.findAllByText("soirée entreprise");
      fireEvent.click(firstEventCard[0]); // Clicking on the first soirée entreprise event  

      // Assertions for filtered events  
      expect(await screen.findByText("Conférence #productCON")).toBeInTheDocument();
      expect(screen.queryByText("Forum #productCON")).not.toBeInTheDocument();
    });
  });

  describe("and we click on an event", () => {
    it("the event detail is displayed", async () => {
      api.loadData = jest.fn().mockResolvedValue(data);
      render(
        <DataProvider>
          <Events />
        </DataProvider>
      );

      // Clicking the event to see its details  
      fireEvent.click(await screen.findByText("Conférence #productCON"));

      // Assert details are shown  
      expect(await screen.findByText("24-25-26 Février")).toBeInTheDocument();
      expect(await screen.findByText("1 site web dédié")).toBeInTheDocument();
    });
  });
});