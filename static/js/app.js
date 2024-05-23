// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
      let meta_data = data.metadata

    // Filter the metadata for the object with the desired sample number
      let info = meta_data.filter(item => item.id == sample)

    // Use d3 to select the panel with id of `#sample-metadata`
      let panel = d3.select("#sample-metadata")

    // Use `.html("") to clear any existing metadata
      panel.html("")

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    info.forEach((item) => {
      Object.entries(item).forEach(([key, value]) => {
        panel.append("p").text(`${key}: ${value}`);
      });
  });
})
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    current_data = data.samples

    // Filter the samples for the object with the desired sample number
    let info = current_data.filter(item => item.id === sample)[0]
    // Get the otu_ids, otu_labels, and sample_values
    let otu_ids = info.otu_ids
    let otu_labels = info.otu_labels
    let sample_values = info.sample_values
    // Build a Bubble Chart
    let trace2 = {
      x: otu_ids,
      y:sample_values,
      text:otu_labels,
      mode: 'markers' ,
      marker: {
        size: sample_values,
        color: otu_ids
      }
    }
    let data_bubble = [trace2]
      let layout_bubble = {
        title: "Bacteria Cultures Per Sample"
      }
    
    // Render the Bubble Chart
    Plotly.newPlot("bubble" , data_bubble, layout_bubble)

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
      otu_ids = otu_ids.map(entry => "OTU " + String(entry))

    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    let sorted_values = sample_values.sort((a,b) => b.sample_values - a.sample_values);
    let sliced_values = sorted_values.slice(0,10)
    sliced_values.reverse()
    
    // sort and slice
    let trace1 = {
      x: sliced_values,
      y: otu_ids,
      text: otu_labels,
      type: "bar" ,
      orientation: "h"
    }
    let data_bar = [trace1]
    let layout_bar = {
      title: "Top 10 Bacteria Cultures Found",
      margin: {
        l: 100,
        r: 100,
        t: 100,
        b: 100
      }
    }
    // Render the Bar Chart
      Plotly.newPlot("bar" , data_bar, layout_bar)
  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
   sample_names = data.names


    // Use d3 to select the dropdown with id of `#selDataset`
    let dropdownnames = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    for( i = 0 ; i < sample_names.length; i++) {
      dropdownnames.append("option").text(sample_names[i]).property("value", sample_names[i]);
        }

    // Get the first sample from the list
    let first_sample = d3.select("#selDataset").property("value");

    // Build charts and metadata panel with the first sample
        buildCharts(first_sample)
        buildMetadata(first_sample)
  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
buildCharts(newSample)
buildMetadata(newSample)
}

// Initialize the dashboard
init();
