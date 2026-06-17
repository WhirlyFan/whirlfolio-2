import type { CareerNode, NodeType } from './types'
import { profile } from './profile'
import { experience } from './experience'
import { education } from './education'
import { projects } from './projects'
import { research } from './research'
import { photography } from './photography'

export { profile, photography }
export type { CareerNode, NodeType, Profile, SkillGroup, NodeLink } from './types'
export type { Photo, Photography } from './photography'

/** All career nodes, grouped — drives the ordered sections in the list view. */
export const sections: { type: NodeType; label: string; nodes: CareerNode[] }[] = [
  { type: 'experience', label: 'Experience', nodes: experience },
  { type: 'education', label: 'Education', nodes: education },
  { type: 'project', label: 'Projects', nodes: projects },
  { type: 'research', label: 'Research', nodes: research },
]

/** Flat list of every node — drives the galaxy stars. */
export const allNodes: CareerNode[] = sections.flatMap((s) => s.nodes)

/** Look up a node by id (used to resolve the selected star → detail panel). */
export const nodeById = (id: string | null): CareerNode | undefined =>
  id ? allNodes.find((n) => n.id === id) : undefined

/** Brand color per node type — shared by stars (3D) and badges/cards (2D). */
export const typeColor: Record<NodeType, string> = {
  experience: '#7dd3fc', // sky
  education: '#c4b5fd', // violet
  project: '#5eead4', // teal
  research: '#fcd34d', // amber
}

export const typeLabel: Record<NodeType, string> = {
  experience: 'Experience',
  education: 'Education',
  project: 'Project',
  research: 'Research',
}
