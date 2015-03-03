#' <Add Title>
#'
#' <Add Description>
#'
#' @import htmlwidgets
#'
#' @export
competitionwidget <- function(width = NULL, height = NULL) {

  # forward options using x
  x = list()

  # create widget
  htmlwidgets::createWidget(
    name = 'competitionwidget',
    x,
    width = width,
    height = height,
    package = 'mathmodels'
  )
}

#' Widget output function for use in Shiny
#'
#' @export
competitionwidgetOutput <- function(outputId, width = '100%', height = '400px'){
  shinyWidgetOutput(outputId, 'competitionwidget', width, height, package = 'mathmodels')
}

#' Widget render function for use in Shiny
#'
#' @export
renderCompetitionwidget <- function(expr, env = parent.frame(), quoted = FALSE) {
  if (!quoted) { expr <- substitute(expr) } # force quoted
  shinyRenderWidget(expr, competitionwidgetOutput, env, quoted = TRUE)
}
