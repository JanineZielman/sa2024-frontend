import dateSvgMarkup from './dateSvgMarkup';

const DateSvg = (props) => (
  <div
    {...props}
    dangerouslySetInnerHTML={{ __html: dateSvgMarkup }}
  />
);

export default DateSvg;
