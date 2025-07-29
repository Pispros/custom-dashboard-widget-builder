const database = require("./data.json");
const fs = require("fs");

const getWidgets = () => {
  try {
    return database.widgets;
  } catch (error) {
    console.error("Error fetching widgets:", error);
    throw error;
  }
};

const addWidget = (data) => {
  try {
    const widgets = [...database.widgets, data];
    const updatedDatabase = { ...database, widgets };

    fs.writeFileSync("./data.json", JSON.stringify(updatedDatabase, null, 2));
  } catch (error) {
    console.error("Error adding widget:", error);
    throw error;
  }
};

const deleteWidget = (id) => {
  try {
    // Filter out the widget with the matching id
    const widgets = database.widgets.filter((widget) => widget.id !== id);

    // Check if widget was found and deleted
    if (widgets.length === database.widgets.length) {
      throw new Error(`Widget with id ${id} not found`);
    }

    // Create updated database
    const updatedDatabase = { ...database, widgets };

    // Write to file
    fs.writeFileSync("./data.json", JSON.stringify(updatedDatabase, null, 2));

    return { success: true, message: `Widget with id ${id} deleted` };
  } catch (error) {
    console.error("Error deleting widget:", error);
    throw error;
  }
};

const getDataStream = (sourceIdentifier) => {
  try {
    return database.dataStream.filter(
      (stream) => stream.content.sourceIdentifier === sourceIdentifier
    );
  } catch (error) {
    console.error("Error fetching widgets:", error);
    throw error;
  }
};

module.exports = {
  addWidget,
  deleteWidget,
  getWidgets,
  getDataStream,
};
