import type {  Request, Response } from 'express';
import { EmployeeReflection, AdminValidation } from '../models/history.model.js';
import type { IEmployeeReflection, IAdminValidation } from '../types/history.types.js';
import { Types } from 'mongoose';
import { memberOfProjectTeam } from '../utils/projectAccess.util.js';

export const submitReflection = async (req: Request, res: Response) => {
  try {
    const reflectionData: IEmployeeReflection = req.body;
    if(!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const isMember = await memberOfProjectTeam(req.user.id, new Types.ObjectId(reflectionData.projectId));
    if(!isMember) {
      return res.status(403).json({ message: 'Forbidden — user is not a member of the project team' });
    }
    
    reflectionData.employeeId = new Types.ObjectId(req.user.id);
    const reflection = new EmployeeReflection(reflectionData);
    await reflection.save();
    res.status(201).json({ message: 'Reflection submitted successfully', reflection });
  } catch (error) {
    res.status(500).json({ message: 'Error submitting reflection', error });
  }
};

export const submitValidation = async (req: Request, res: Response) => {
  try {
    const validationData: IAdminValidation = req.body;
    if(!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    validationData.adminId = new Types.ObjectId(req.user.id);
    const validation = new AdminValidation(validationData);
    await validation.save();
    res.status(201).json({ message: 'Validation submitted successfully', validation });
  } catch (error) {
    res.status(500).json({ message: 'Error submitting validation', error });
  }
};

export const getReflectionsByProject = async (req: Request, res: Response) => {
  try {
    const projectId = req.params.projectId;
    if(!projectId || Array.isArray(projectId) || typeof projectId !== 'string' || !Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ message: 'Invalid projectId' });
    }

    const reflections = await EmployeeReflection.find({ projectId });

    if(!reflections || reflections.length === 0) {
      return res.status(404).json({ message: 'No reflections found for this project' });
    }

    res.status(200).json({ reflections });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reflections', error });
  }
};

// export const getValidationsByProject = async (req: Request, res: Response) => {
//   try {
//     const projectId = req.params.projectId;
//     if(!projectId || Array.isArray(projectId) || typeof projectId !== 'string' || !Types.ObjectId.isValid(projectId)) {
//       return res.status(400).json({ message: 'Invalid projectId' });
//     }

//     const validations = await AdminValidation.find({ projectId });

//     if(!validations || validations.length === 0) {
//       return res.status(404).json({ message: 'No validations found for this project' });
//     }

//     res.status(200).json({ validations });
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching validations', error });
//   }
// };

export const getReflectionByEmployeeAndProject = async (req: Request, res: Response) => {
  try {
    const { employeeId, projectId } = req.params;

    if(!projectId || Array.isArray(projectId) || typeof projectId !== 'string' || !Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ message: 'Invalid projectId' });
    }

    if(!employeeId || Array.isArray(employeeId) || typeof employeeId !== 'string' || !Types.ObjectId.isValid(employeeId)) {
      return res.status(400).json({ message: 'Invalid employeeId' });
    }

    const reflection = await EmployeeReflection.findOne({ employeeId, projectId });

    if(!reflection) {
      return res.status(404).json({ message: 'Reflection not found' });
    }

    res.status(200).json({ reflection });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reflection', error });
  }
};

export const getValidationsByEmployeeAndProject = async (req: Request, res: Response) => {
  try {
    const { employeeId, projectId } = req.params;
    if(!employeeId || Array.isArray(employeeId) || typeof employeeId !== 'string' || !Types.ObjectId.isValid(employeeId)) {
      return res.status(400).json({ message: 'Invalid employeeId' });
    }
    if(!projectId || Array.isArray(projectId) || typeof projectId !== 'string' || !Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ message: 'Invalid projectId' });
    }
    const validations = await AdminValidation.find({ employeeId, projectId });

    if(!validations || validations.length === 0) {
      return res.status(404).json({ message: 'No validations found for this employee and project' });
    }

    res.status(200).json({ validations });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching validations', error });
  }
}; 



export const getValidationByAdminAndEmployeeAndProject = async (req: Request, res: Response) => {
  try {
    const {employeeId, projectId } = req.params;
    const adminId = req.user?.id;

    if(!adminId || Array.isArray(adminId) || typeof adminId !== 'string' || !Types.ObjectId.isValid(adminId)) {
      return res.status(400).json({ message: 'Invalid adminId' });
    }

    if(!employeeId || Array.isArray(employeeId) || typeof employeeId !== 'string' || !Types.ObjectId.isValid(employeeId)) {
      return res.status(400).json({ message: 'Invalid employeeId' });
    }

    if(!projectId || Array.isArray(projectId) || typeof projectId !== 'string' || !Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ message: 'Invalid projectId' });
    } 

    const validation = await AdminValidation.findOne({ adminId, employeeId, projectId });
    if(!validation) {
      return res.status(404).json({ message: 'Validation not found' });
    }

    res.status(200).json({ validation });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching validation', error });
  }
};

export const getValidatedSkillsByEmployeeAndProject = async (req: Request, res: Response) => {
  try {
    const { employeeId, projectId } = req.params;

    if(!employeeId || Array.isArray(employeeId) || typeof employeeId !== 'string' || !Types.ObjectId.isValid(employeeId)) {
      return res.status(400).json({ message: 'Invalid employeeId' });
    }
    if(!projectId || Array.isArray(projectId) || typeof projectId !== 'string' || !Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ message: 'Invalid projectId' });
    }
    const reflection = await EmployeeReflection.findOne({ employeeId, projectId });

    if(!reflection) {
      return res.status(404).json({ message: 'Reflection not found' });
    }

    const validations = await AdminValidation.find({ employeeId, projectId });
    if(!validations || validations.length === 0) {
      return res.status(404).json({ message: 'No validations found for this employee and project' });
    }

    const validatedSkills = validations.reduce((acc: string[], validation : IAdminValidation) => {
      return acc.concat(validation.skillValidation);
    }, []);

    let skillSet : string[] = reflection.skillsGainedOrUsed.filter((skill : string) => validatedSkills.includes(skill));

    res.status(200).json({ skills: skillSet });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching validated skills', error });
  }
};
