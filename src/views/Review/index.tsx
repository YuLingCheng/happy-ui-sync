import * as React from "react";

const TableDiff = ({ changeType, changedColor, colorDiff, oldColors }) => (
  <>
    <h4 className="color-name">{changedColor}</h4>
    <table>
      <thead>
        <tr>
          <td className="tone-title">Tone</td>
          {colorDiff[changeType][changedColor]
            ? Object.keys(
                colorDiff[changeType][changedColor]
              ).map((colorTone) => <td key={colorTone}>{colorTone}</td>)
            : Object.keys(oldColors[changedColor]).map((colorTone) => (
                <td key={colorTone}>{colorTone}</td>
              ))}
        </tr>
      </thead>
      <tbody>
        <tr>
          <td
            className={
              changeType === "deleted" ? "deleted-color" : "added-color"
            }
          >
            {changeType === "deleted" ? "Removed" : "New Color"}
          </td>
          {colorDiff[changeType][changedColor]
            ? Object.keys(colorDiff[changeType][changedColor]).map(
                (colorTone) => (
                  <td
                    key={colorTone}
                    className="color-value"
                    style={{
                      backgroundColor:
                        colorDiff[changeType][changedColor][colorTone],
                    }}
                  >
                    {colorDiff[changeType][changedColor][colorTone]}
                  </td>
                )
              )
            : Object.keys(oldColors[changedColor]).map((colorTone) => (
                <td
                  key={colorTone}
                  className="color-value"
                  style={{
                    backgroundColor: oldColors[changedColor][colorTone],
                  }}
                >
                  {oldColors[changedColor][colorTone]}
                </td>
              ))}
        </tr>
        {changeType === "updated" && (
          <tr>
            <td className={`${changeType}-color`}>Old Color</td>
            {Object.keys(colorDiff[changeType][changedColor]).map(
              (colorTone) => (
                <td
                  key={colorTone}
                  className="color-value"
                  style={{
                    backgroundColor: oldColors[changedColor][colorTone],
                  }}
                >
                  {oldColors[changedColor][colorTone]}
                </td>
              )
            )}
          </tr>
        )}
      </tbody>
    </table>
  </>
);

const Diff = ({ changeType, colorDiff, oldColors }) => {
  const changes = Object.keys(colorDiff[changeType]);
  if (changes.length === 0) {
    return <h3 className="review-section-title">Nothing {changeType}</h3>;
  }
  return (
    <>
      <h3 className="review-section-title">{changeType}</h3>
      {changes.map((changedColor) => (
        <TableDiff
          key={changedColor}
          changeType={changeType}
          changedColor={changedColor}
          colorDiff={colorDiff}
          oldColors={oldColors}
        />
      ))}
    </>
  );
};

const Review = ({ colorDiff, oldColors }) => {
  if (!colorDiff || !oldColors) return null;
  return (
    <>
      <p className="banner info-banner">
        <span className="info-icon">?</span>
        Step 2/2: Review your changes
      </p>
      <div id="review-panel">
        {Object.keys(colorDiff).map((changeType) => (
          <Diff
            key={changeType}
            changeType={changeType}
            colorDiff={colorDiff}
            oldColors={oldColors}
          />
        ))}
      </div>
    </>
  );
};

export default Review;
