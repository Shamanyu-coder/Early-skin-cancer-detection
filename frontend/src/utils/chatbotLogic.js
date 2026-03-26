export const getBotResponse = (input) => {
  const lowerInput = input.toLowerCase();
  
  if (lowerInput.includes('melanoma')) {
    return "Melanoma is the most serious type of skin cancer. Look for the ABCDE signs: Asymmetry, Border irregularity, Color changes, Diameter over 6mm, and Evolving shape or size.";
  }
  if (lowerInput.includes('sunscreen') || lowerInput.includes('spf')) {
    return "The AAD recommends using a broad-spectrum, water-resistant sunscreen with an SPF of 30 or higher applied every two hours, even on cloudy days.";
  }
  if (lowerInput.includes('benign')) {
    return "A benign lesion is non-cancerous. While it is not an immediate threat, it should still be monitored routinely by a dermatologist for any changes over time.";
  }
  if (lowerInput.includes('malignant') || lowerInput.includes('cancerous')) {
    return "A malignant lesion indicates the presence of cancerous cells. This requires immediate medical attention and biopsy by a certified dermatologist.";
  }
  if (lowerInput.includes('accuracy') || lowerInput.includes('model') || lowerInput.includes('ai')) {
    return "Our artificial intelligence utilizes a deep learning CNN (MobileNetV2) architecture. While the model achieves high preliminary screening accuracy against datasets like HAM10000, it cannot replace a clinical physical biopsy.";
  }
  if (lowerInput.includes('hello') || lowerInput.includes('hi')) {
    return "Hello! I am the Skin Detection AI clinical assistant. You can ask me about melanoma, skin cancer prevention, our AI accuracy, or the ABCDE rules of mole checking.";
  }
  if (lowerInput.includes('symptom') || lowerInput.includes('sign')) {
    return "Common symptomatic signs of skin cancer include a sore that doesn't heal, spread of pigment from the border of a spot into surrounding skin, redness or a new swelling beyond the border of a mole, or a change in sensation (itchiness, tenderness, or pain).";
  }
  if (lowerInput.includes('cost') || lowerInput.includes('price')) {
    return "This is a demonstration clinical platform, providing preliminary AI screenings at no cost.";
  }
  if (lowerInput.includes('doctor') || lowerInput.includes('hospital') || lowerInput.includes('clinic')) {
    return "If you are concerned about a skin lesion, please search for a board-certified dermatologist in your local area for a professional physical examination.";
  }
  if (lowerInput.includes('upload') || lowerInput.includes('how to')) {
    return "To use the system, simply go to your Dashboard, click the upload area, select a clear, well-lit dermatoscopic or close-up image of the skin lesion (.png or .jpg), and click 'Analyze Image'.";
  }
  
  return "I'm not entirely sure about that. I specialize in preliminary skin lesion screenings, the ABCDE rules of melanoma, and general skin cancer inquiries. Please rephrase or consult a board-certified dermatologist for medical advice.";
};
