import type { CareerNode } from './types'

export const research: CareerNode[] = [
  {
    id: 'nli-robustness',
    type: 'research',
    title: 'Enhancing Natural Language Inference Robustness Through Adversarial Dataset Fine-Tuning',
    org: 'The University of Texas at Austin',
    start: 'Dec 2024',
    summary: 'Improving NLI model robustness and generalization with adversarial fine-tuning.',
    highlights: [
      'Fine-tuned an Electra-small model with adversarial datasets, achieving an 8.09% accuracy increase on out-of-distribution data, demonstrating improved robustness and generalization',
    ],
    tags: ['PyTorch', 'NLP', 'Electra', 'Adversarial Training'],
  },
]
