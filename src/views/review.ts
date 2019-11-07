const displayReviewPanel = (colorDiff, oldColors) => {
  Object.keys(colorDiff).forEach(changeType => {
    const changesDiffContainer = document.getElementById('review-panel');
    const sectionTitle = document.createElement('h3');
    sectionTitle.textContent = changeType;
    sectionTitle.className = 'review-section-title';
    changesDiffContainer.append(sectionTitle);

    const changedColors = Object.keys(colorDiff[changeType]);
    changedColors.forEach(changedColor => {
      const colorDiffContainer = document.createElement('div');
      const colorName = document.createElement('h4');
      colorName.textContent = changedColor;
      colorName.className = 'color-name';
      colorDiffContainer.append(colorName);
      const colorTable = document.createElement('table');
      const colorTableHeader = colorTable.createTHead();
      const colorTableHeaderRow = colorTableHeader.insertRow();
      const toneCellTitle = colorTableHeaderRow.insertCell();
      toneCellTitle.textContent = 'Tone';
      toneCellTitle.className = 'tone-title';
      const colorTableBody = colorTable.createTBody();
      const newColorValueRow = colorTableBody.insertRow();
      const newColorValueRowTitle = newColorValueRow.insertCell();
      newColorValueRowTitle.textContent =
        changeType === 'deleted' ? 'Removed' : 'New Color';
      newColorValueRowTitle.className =
        changeType === 'deleted' ? 'removed-color' : 'added-color';
      if (colorDiff[changeType][changedColor]) {
        Object.keys(colorDiff[changeType][changedColor]).forEach(colorTone => {
          const toneCell = colorTableHeaderRow.insertCell();
          toneCell.textContent = colorTone;
          const colorValueCell = newColorValueRow.insertCell();
          const colorValue = colorDiff[changeType][changedColor][colorTone];
          colorValueCell.textContent = colorValue;
          colorValueCell.style.backgroundColor = colorValue;
          colorValueCell.className = 'color-value';
        });
      } else {
        Object.keys(oldColors[changedColor]).forEach(colorTone => {
          const toneCell = colorTableHeaderRow.insertCell();
          toneCell.textContent = colorTone;
          const colorValueCell = newColorValueRow.insertCell();
          const colorValue = oldColors[changedColor][colorTone];
          colorValueCell.textContent = colorValue;
          colorValueCell.style.backgroundColor = colorValue;
          colorValueCell.className = 'color-value';
        });
      }
      if (changeType === 'updated') {
        const oldColorValueRow = colorTableBody.insertRow();
        const oldColorValueRowTitle = oldColorValueRow.insertCell();
        oldColorValueRowTitle.textContent = 'Old Color';
        oldColorValueRowTitle.className = 'removed-color';
        Object.keys(colorDiff[changeType][changedColor]).forEach(colorTone => {
          const colorValueCell = oldColorValueRow.insertCell();
          const colorValue = oldColors[changedColor][colorTone];
          colorValueCell.textContent = colorValue;
          colorValueCell.style.backgroundColor = colorValue;
          colorValueCell.className = 'color-value';
        });
      }

      colorDiffContainer.append(colorTable);
      changesDiffContainer.append(colorDiffContainer);
    });
  });

  document.getElementById('confirmation-panel').style.display = 'block';
};

export default displayReviewPanel;
