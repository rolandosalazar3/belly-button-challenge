// Use the D3 library to read in samples.json from the URL.
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Fetch the JSON data and console log it
d3.json(url).then(function(data) {
  console.log(data);
});

// Initialize function
function init() {

  // Use D3 to select the dropdown menu
  let dropdownMenu = d3.select("#selDataset");

  // D3 to get sample names
  d3.json(url).then((data) => {
      
      // Set a variable for the sample names
      let names = data.names;

      // Add  samples to dropdown menu
      names.forEach((sample) => {

          // Log the ID value
          console.log(sample);
          dropdownMenu.append("option")
          .text(sample)
          .property("value",sample);
      });

      // Variable for the first sample from the list
      let sample_one = names[0];
      // Log the value of sample_one
      console.log(sample_one);

      // Build the initial plots
      buildMetadata(sample_one);
      buildChart(sample_one);
  });
};

// Function for metadata info
function buildMetadata(sample) {

  // D3 to retrieve the data
  d3.json(url).then((data) => {

      // Retrieve metadata
      let metadata = data.metadata;

      // Filter based on the sample
      let data_value = metadata.filter(result => result.id == sample);

      // Log the metadata
      console.log(data_value)

      // Variable for the first index from the array
      let first_value = data_value[0];

      d3.select("#sample-metadata").html("");

      // Add each key and value
      Object.entries(first_value).forEach(([key,data_value]) => {

          // Log the individual keys and values
          console.log(key,data_value);

          d3.select("#sample-metadata").append("h5").text(`${key}: ${data_value}`);
      });
  });

};

// Chart function
function buildChart(sample) {

  // D3 to retrieve the data
  d3.json(url).then((data) => {

      // Retrieve samples
      let sampleInfo = data.samples;

      // Filter by the value of the sample
      let value = sampleInfo.filter(result => result.id == sample);

      // Variable for the first index from the array
      let data_value = value[0];

      // Variables for the otu_ids, lables, and sample values
      let otu_ids = data_value.otu_ids;
      let otu_labels = data_value.otu_labels;
      let sample_values = data_value.sample_values;

      // Log the data to the console
      console.log(otu_ids,otu_labels,sample_values);

      // Variable for the top ten items to display in descending order
      let yticks = otu_ids.slice(0,10).map(id => `OTU ${id}`).reverse();
      let xticks = sample_values.slice(0,10).reverse();
      let labels = otu_labels.slice(0,10).reverse();
      
      // Trace for the bar chart
      let trace1 = {
          x: xticks,
          y: yticks,
          text: labels,
          type: "bar",
          orientation: "h"
      };

      // Layout for bar chart
      let layout = {
          title: "Top 10 OTUs"
      };

      // Plot the bar chart
      Plotly.newPlot("bar", [trace1], layout)

      // Trace for bubble chart
      let trace2 = {
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: "markers",
        marker: {
            size: sample_values,
            color: otu_ids,
            colorscale: "Earth"
        }
    };

    // Layout for bubble chart
    let layout1 = {
        hovermode: "closest",
        xaxis: {title: "OTU ID"},
    };

    // Plot the bubble chart
    Plotly.newPlot("bubble", [trace2], layout1)
  });

};

// Function to update for each new sample
function optionChanged(value) { 

  // Log the value
  console.log(value); 

  // Call functions 
  buildMetadata(value);
  buildChart(value);
};

// Call the initialize function
init();