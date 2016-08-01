window.repopulate = function () {
  var width = 320
    , height = 200

  // Finance
  createValueBarGraph('#revenue', width, height, 'data/revenue.tsv')
  createValueBarGraph('#costs', width, height, 'data/costs.tsv')
  createValueBarGraph('#sales-vs-target', width, height, 'data/sales-vs-target.tsv', [-1, 1])

  // Sales
  createPercentageAreaGraph('#win-rate', width, height, 'data/win-rate.tsv')
  createValueBarGraph('#sales', width, height, 'data/sales.tsv')
  createValueBarGraph('#leads', width, height, 'data/leads.tsv')
  createValueBarGraph('#pipeline', width, height, 'data/pipeline.tsv')

  // Production
  createPercentageAreaGraph('#utilisation', width, height, 'data/utilisation.tsv')
  createValueBarGraph('#active-projects', width, height, 'data/projects.tsv')
  createValueBarGraph('#tickets', width, height, 'data/tickets.tsv')

  // HR Stats
  createValueBarGraph('#head-count', width, height, 'data/head-count.tsv')
  createValueBarGraph('#sick-days', width, height, 'data/sick.tsv')
  createValueBarGraph('#holiday', width, height, 'data/holiday.tsv')
}
