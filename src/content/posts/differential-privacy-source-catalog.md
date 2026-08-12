---
title: 'Differential Privacy in Machine Learning & Computer Vision: Source Catalog'
description: A structured catalog of foundational and recent differential-privacy work spanning deep learning, computer vision, video, facial privacy, and multimodal models.
published: 2026-08-12
tags: [differential-privacy, machine-learning, computer-vision, multimodal-models]
draft: false
---

This catalog provides a comprehensive, structured reference for the nine sources currently active in your notebook. To ensure readability, we have organized this document into a high-level **Source Overview Table** followed by **Detailed Reference Cards** containing the full abstracts and summaries for each publication.

---

## 📊 Source Overview Table

| # | Title | Primary Authors | Date Published | Document Link |
|---|---|---|---|---|
| **1** | Deep Learning with Differential Privacy | M. Abadi, A. Chu, I. Goodfellow, et al. | July 2016 (rev. Oct 2016) | [arXiv:1607.00133](https://arxiv.org/abs/1607.00133) |
| **2** | Privacy-Preserving Machine Learning: Methods, Challenges and Directions | R. Xu, N. Baracaldo, J. Joshi | August 2021 (rev. Sept 2021) | [arXiv:2108.04417](https://arxiv.org/abs/2108.04417) |
| **3** | Mixed Differential Privacy in Computer Vision | A. Golatkar, A. Achille, Y. Wang, et al. | March 2022 (CVPR 2022) | [arXiv:2203.11481](https://arxiv.org/abs/2203.11481) |
| **4** | Scalable and Efficient Training of Large CNNs with Differential Privacy | Z. Bu, J. Mao, S. Xu | May 2022 (NeurIPS 2022) | [arXiv:2205.10683](https://arxiv.org/abs/2205.10683) |
| **5** | Differentially Private Video Activity Recognition | Z. Luo, Y. Zou, Y. Yang, et al. | June 2023 (WACV 2024) | [arXiv:2306.15742](https://arxiv.org/abs/2306.15742) |
| **6** | Diff-Privacy: Diffusion-based Face Privacy Protection | X. He, M. Zhu, D. Chen, et al. | September 2023 | [arXiv:2309.05330](https://arxiv.org/abs/2309.05330) |
| **7** | Safe-LLaVA: A Privacy-Preserving Vision-Language Dataset & Benchmark | Y. Kim, S. Swetha, F. Kagdi, M. Shah | August 2025 (CVPR 2026) | [arXiv:2509.00192](https://arxiv.org/abs/2509.00192) |
| **8** | A Comprehensive Guide to Differential Privacy: From Theory to User Expectations | N. Karmitsa, A. Airola, T. Pahikkala, et al. | September 2025 (rev. Apr 2026) | [arXiv:2509.03294](https://arxiv.org/abs/2509.03294) |
| **9** | Research report: Differential Privacy in Machine Learning and Computer Vision | Gemini Notebook (Synthesis Report) | Compiled August 12, 2026 | *Internal Workspace Asset* |

---

## 📄 Detailed Reference Cards

### 1. Deep Learning with Differential Privacy
- **Authors:** Martín Abadi, Andy Chu, Ian Goodfellow, H. Brendan McMahan, Ilya Mironov, Kunal Talwar, Li Zhang
- **Published Date:** July 1, 2016 (Revised October 24, 2016)
- **Venue:** Proceedings of the 2016 ACM SIGSAC Conference on Computer and Communications Security (ACM CCS)
- **Link:** [https://arxiv.org/abs/1607.00133](https://arxiv.org/abs/1607.00133)

> **Notebook Summary:**
> A seminal work that introduces a differentially private stochastic gradient descent (DP-SGD) algorithm and a moments accountant for training deep neural networks with formal privacy guarantees.

> **Abstract:**
> Machine learning techniques based on neural networks are achieving remarkable results in a wide variety of domains. Often, the training of models requires large, representative datasets, which may be crowdsourced and contain sensitive information. The models should not expose private information in these datasets. Addressing this goal, we develop new algorithmic techniques for learning and a refined analysis of privacy costs within the framework of differential privacy. Our implementation and experiments demonstrate that we can train deep neural networks with non-convex objectives, under a modest privacy budget, and at a manageable cost in software complexity, training efficiency, and model quality.

---

### 2. Privacy-Preserving Machine Learning: Methods, Challenges and Directions
- **Authors:** Runhua Xu, Nathalie Baracaldo, James Joshi
- **Published Date:** August 10, 2021 (Revised September 22, 2021)
- **Link:** [https://arxiv.org/abs/2108.04417](https://arxiv.org/abs/2108.04417)

> **Notebook Summary:**
> Provides a comprehensive survey of privacy-preserving machine learning methods, highlighting major challenges and research directions in integrating privacy guarantees into model training.

> **Abstract:**
> Machine learning (ML) is increasingly being adopted in a wide variety of application domains. Usually, a well-performing ML model relies on a large volume of training data and high-powered computational resources. Such a need for and the use of huge volumes of data raise serious privacy concerns because of the potential risks of leakage of highly privacy-sensitive information; further, the evolving regulatory environments that increasingly restrict access to and use of privacy-sensitive data add significant challenges to fully benefiting from the power of ML for data-driven applications. A trained ML model may also be vulnerable to adversarial attacks such as membership, attribute, or property inference attacks and model inversion attacks. Hence, well-designed privacy-preserving ML (PPML) solutions are critically needed for many emerging applications. Increasingly, significant research efforts from both academia and industry can be seen in PPML areas that aim toward integrating privacy-preserving techniques into ML pipeline or specific algorithms, or designing various PPML architectures. In particular, existing PPML research cross-cut ML, systems and applications design, as well as security and privacy areas; hence, there is a critical need to understand state-of-the-art research, related challenges and a research roadmap for future research in PPML area. In this paper, we systematically review and summarize existing privacy-preserving approaches and propose a Phase, Guarantee, and Utility (PGU) triad based model to understand and guide the evaluation of various PPML solutions by decomposing their privacy-preserving functionalities. We discuss the unique characteristics and challenges of PPML and outline possible research directions that leverage as well as benefit multiple research communities such as ML, distributed systems, security and privacy.

---

### 3. Mixed Differential Privacy in Computer Vision
- **Authors:** Aditya Golatkar, Alessandro Achille, Yu-Xiang Wang, Aaron Roth, Michael Kearns, Stefano Soatto
- **Published Date:** March 22, 2022 (Revised March 28, 2022)
- **Venue:** Accepted at CVPR 2022
- **Link:** [https://arxiv.org/abs/2203.11481](https://arxiv.org/abs/2203.11481)

> **Notebook Summary:**
> Introduces AdaMix, an adaptive algorithm combining public pre-training and private fine-tuning to achieve superior privacy-utility trade-offs for computer vision classifiers.

> **Abstract:**
> We introduce AdaMix, an adaptive differentially private algorithm for training deep neural network classifiers using both private and public image data. While pre-training language models on large public datasets has enabled strong differential privacy (DP) guarantees with minor loss of accuracy, a similar practice yields punishing trade-offs in vision tasks. A few-shot or even zero-shot learning baseline that ignores private data can outperform fine-tuning on a large private dataset. AdaMix incorporates few-shot training, or cross-modal zero-shot learning, on public data prior to private fine-tuning, to improve the trade-off. AdaMix reduces the error increase from the non-private upper bound from the 167-311% of the baseline, on average across 6 datasets, to 68-92% depending on the desired privacy level selected by the user. AdaMix tackles the trade-off arising in visual classification, whereby the most privacy sensitive data, corresponding to isolated points in representation space, are also critical for high classification accuracy. In addition, AdaMix comes with strong theoretical privacy guarantees and convergence analysis.

---

### 4. Scalable and Efficient Training of Large Convolutional Neural Networks with Differential Privacy
- **Authors:** Zhiqi Bu, Jialin Mao, Shiyun Xu
- **Published Date:** May 21, 2022 (Revised November 29, 2022)
- **Venue:** Accepted to NeurIPS 2022
- **Link:** [https://arxiv.org/abs/2205.10683](https://arxiv.org/abs/2205.10683)

> **Notebook Summary:**
> Proposes mixed ghost clipping to resolve the computational and memory bottleneck of per-sample gradient clipping in DP training for large CNNs and Vision Transformers.

> **Abstract:**
> Large convolutional neural networks (CNN) can be difficult to train in the differentially private (DP) regime, since the optimization algorithms require a computationally expensive operation, known as the per-sample gradient clipping. We propose an efficient and scalable implementation of this clipping on convolutional layers, termed as the mixed ghost clipping, that significantly eases the private training in terms of both time and space complexities, without affecting the accuracy. The improvement in efficiency is rigorously studied through the first complexity analysis for the mixed ghost clipping and existing DP training algorithms. Extensive experiments on vision classification tasks, with large ResNet, VGG, and Vision Transformers, demonstrate that DP training with mixed ghost clipping adds $1\sim 10\%$ memory overhead and $<2\times$ slowdown to the standard non-private training. Specifically, when training VGG19 on CIFAR10, the mixed ghost clipping is $3\times$ faster than state-of-the-art Opacus library with $18\times$ larger maximum batch size. To emphasize the significance of efficient DP training on convolutional layers, we achieve $96.7\%$ accuracy on CIFAR10 and $83.0\%$ on CIFAR100 at $\epsilon=1$ using BEiT, while the previous best results are $94.8\%$ and $67.4\%$, respectively. We open-source a privacy engine (https://github.com/woodyx218/private_vision) that implements DP training of CNN with a few lines of code.

---

### 5. Differentially Private Video Activity Recognition
- **Authors:** Zelun Luo, Yuliang Zou, Yijin Yang, Zane Durante, De-An Huang, Zhiding Yu, Chaowei Xiao, Li Fei-Fei, Animashree Anandkumar
- **Published Date:** June 27, 2023
- **Venue:** Accepted to WACV 2024
- **Link:** [https://arxiv.org/abs/2306.15742](https://arxiv.org/abs/2306.15742)

> **Notebook Summary:**
> Addresses the challenge of action recognition in video datasets by designing a differentially private video activity recognition framework with theoretical privacy-utility guarantees.

> **Abstract:**
> In recent years, differential privacy has seen significant advancements in image classification; however, its application to video activity recognition remains under-explored. This paper addresses the challenges of applying differential privacy to video activity recognition, which primarily stem from: (1) a discrepancy between the desired privacy level for entire videos and the nature of input data processed by contemporary video architectures, which are typically short, segmented clips; and (2) the complexity and sheer size of video datasets relative to those in image classification, which render traditional differential privacy methods inadequate. To tackle these issues, we propose Multi-Clip DP-SGD, a novel framework for enforcing video-level differential privacy through clip-based classification models. This method samples multiple clips from each video, averages their gradients, and applies gradient clipping in DP-SGD without incurring additional privacy loss. Moreover, we incorporate a parameter-efficient transfer learning strategy to make the model scalable for large-scale video datasets. Through extensive evaluations on the UCF-101 and HMDB-51 datasets, our approach exhibits impressive performance, achieving $81\%$ accuracy with a privacy budget of $\epsilon=5$ on UCF-101, marking a $76\%$ improvement compared to a direct application of DP-SGD. Furthermore, we demonstrate that our transfer learning strategy is versatile and can enhance differentially private image classification across an array of datasets including CheXpert, ImageNet, CIFAR-10, and CIFAR-100.

---

### 6. Diff-Privacy: Diffusion-based Face Privacy Protection
- **Authors:** Xiao He, Mingrui Zhu, Dongxin Chen, Nannan Wang, Xinbo Gao
- **Published Date:** September 11, 2023
- **Venue:** IEEE Transactions on Circuits and Systems for Video Technology (TCSVT)
- **Link:** [https://arxiv.org/abs/2309.05330](https://arxiv.org/abs/2309.05330)

> **Notebook Summary:**
> Unifies face anonymization and identity hiding by utilizing a pre-trained diffusion model to generate photorealistic face-protected images while allowing authentic recovery.

> **Abstract:**
> Privacy protection has become a top priority as the proliferation of AI techniques has led to widespread collection and misuse of personal data. Anonymization and visual identity information hiding are two important facial privacy protection tasks that aim to remove identification characteristics from facial images at the human perception level. However, they have a significant difference in that the former aims to prevent the machine from recognizing correctly, while the latter needs to ensure the accuracy of machine recognition. Therefore, it is difficult to train a model to complete these two tasks simultaneously. In this paper, we unify the task of anonymization and visual identity information hiding and propose a novel face privacy protection method based on diffusion models, dubbed Diff-Privacy. Specifically, we train our proposed multi-scale image inversion module (MSI) to obtain a set of SDM format conditional embeddings of the original image. Based on the conditional embeddings, we design corresponding embedding scheduling strategies and construct different energy functions during the denoising process to achieve anonymization and visual identity information hiding. Extensive experiments have been conducted to validate the effectiveness of our proposed framework in protecting facial privacy.

---

### 7. Safe-LLaVA: A Privacy-Preserving Vision-Language Dataset and Benchmark for Biometric Safety
- **Authors:** Younggun Kim, Sirnam Swetha, Fazil Kagdi, Mubarak Shah
- **Published Date:** August 29, 2025 (Revised October 6, 2025)
- **Venue:** Accepted to CVPR 2026
- **Link:** [https://arxiv.org/abs/2509.00192](https://arxiv.org/abs/2509.00192)

> **Notebook Summary:**
> Presents Safe-LLaVA, a novel multimodal dataset and biometric safety benchmark that filters explicit/implicit biometric details to prevent privacy leakage in vision-language models.

> **Abstract:**
> Multimodal Large Language Models (MLLMs) have demonstrated remarkable capabilities in vision-language tasks. However, these models often infer and reveal sensitive biometric attributes such as race, gender, age, body weight, and eye color; even when such information is not explicitly requested. This raises critical concerns, particularly in real-world applications and socially-sensitive domains. Despite increasing awareness, no publicly available dataset or benchmark exists to comprehensively evaluate or mitigate biometric leakage in MLLMs. To address this gap, we introduce PRISM (Privacy-aware Evaluation of Responses in Sensitive Modalities), a new benchmark designed to assess MLLMs on two fronts: (1) refuse biometric-related queries and (2) implicit biometric leakage in general responses while maintaining semantic faithfulness. Further, we conduct a detailed audit of the widely used LLaVA datasets and uncover extensive biometric leakage across pretraining and instruction data. To address this, we present Safe-LLaVA dataset, the first privacy-preserving MLLM training dataset constructed by systematically removing explicit and implicit biometric information from LLaVA dataset. Our evaluations on PRISM reveal biometric leakages across MLLMs for different attributes, highlighting the detailed privacy-violations. We also fine-tune a model on Safe-LLaVA dataset and show that it substantially reduces the biometric leakages. Together, Safe-LLaVA and PRISM set a new standard for privacy-aligned development and evaluation of MLLMs.

---

### 8. A Comprehensive Guide to Differential Privacy: From Theory to User Expectations
- **Authors:** Napsu Karmitsa, Antti Airola, Tapio Pahikkala, Tinja Pitkämäki
- **Published Date:** September 3, 2025 (Revised April 23, 2026)
- **Link:** [https://arxiv.org/abs/2509.03294](https://arxiv.org/abs/2509.03294)

> **Notebook Summary:**
> Offers an extensive and up-to-date guide to differential privacy (DP), bridging theoretical foundations and practical mechanisms with user expectations and real-world deployment challenges.

> **Abstract:**
> The increasing availability of personal data has enabled significant advances in fields such as machine learning, healthcare, and cybersecurity. However, this data abundance also raises serious privacy concerns, especially in light of powerful re-identification attacks and growing legal and ethical demands for responsible data use. Differential privacy (DP) has emerged as a principled, mathematically grounded framework for mitigating these risks. This review provides a comprehensive survey of DP, covering its theoretical foundations, practical mechanisms, and real-world applications. It explores key algorithmic tools and domain-specific challenges - particularly in privacy-preserving machine learning and synthetic data generation. The report also highlights usability issues and the need for improved communication and transparency in DP systems. Overall, the goal is to support informed adoption of DP by researchers and practitioners navigating the evolving landscape of data privacy.

---

### 9. Research report: Differential Privacy in Machine Learning and Computer Vision
- **Authors:** Compiled by Gemini Notebook (collaborative synthesis from research inputs)
- **Date Published:** Compiled August 12, 2026
- **Link:** *Internal Workspace Asset*

> **Notebook Summary:**
> Synthesizes the core methods, computational scaling solutions, and practical applications of differential privacy in deep learning, federated learning, and computer vision from 2016 to 2026.

> **Abstract / Scope:**
> This report is a curated collection of research papers and key themes compiled to synthesize the current landscape of Differential Privacy in Machine Learning and Computer Vision. It covers mathematical foundations, computational efficiency, and applications across video, image, face, and multimodal datasets.
